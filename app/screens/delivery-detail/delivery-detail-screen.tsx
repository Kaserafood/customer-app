import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { getUniqueId } from "react-native-device-info"
import Ripple from "react-native-material-ripple"
import images from "../../assets/images"
import {
  ButtonFooter,
  Card,
  Checkbox,
  Header,
  Icon,
  Image,
  InputText,
  ModalDeliveryDate,
  Screen,
  Separator,
  Text,
} from "../../components"
import { ModalLocation } from "../../components/location/modal-location"
import { MetaData, Order, Products, useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { getCardType } from "../../utils/card"
import { showMessageError } from "../../utils/messages"
import { ModalStateHandler } from "../../utils/modalState"
import { getFormat } from "../../utils/price"
import { encrypt } from "../../utils/security"
import { loadString, saveString } from "../../utils/storage"
import { getI18nText } from "../../utils/translate"
import { deliverySlotTime, DeliveryTimeList } from "./delivery-time-list"
import { DishesList } from "./dishes-list"
import { Card as CardModel, ModalPaymentCard } from "./modal-payment-card"
import { Totals } from "./totals"

const modalStateLocation = new ModalStateHandler()
const modalDelivery = new ModalStateHandler()
const modalStatePaymentCard = new ModalStateHandler()

export const DeliveryDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "deliveryDetail">
> = observer(({ navigation }) => {
  const { ...methods } = useForm({ mode: "onBlur" })
  const { addressStore, dayStore, cartStore, userStore, commonStore, orderStore } = useStores()
  const [labelDeliveryTime, setLabelDeliveryTime] = useState("")
  const [isPaymentCash, setIsPaymentCash] = useState(false)
  const [isPaymentCard, setIsPaymentCard] = useState(false)
  const [card, setCard] = useState<CardModel>()
  const refDeliveryTimeList = useRef(null)
  const refModalPaymentCard = useRef(null)

  useEffect(() => {
    const loadSavedStrings = async () => {
      const taxId = await loadString("taxId")
      const deliveryTime = await loadString("deliveryTime")
      const customerNote = await loadString("customerNote")
      methods.setValue("taxId", taxId ?? "")
      methods.setValue("deliveryNote", customerNote ?? "")
      setLabelDeliveryTime(deliveryTime ?? "")

      const slotTime = deliverySlotTime.find((slotTime) => slotTime.label === deliveryTime)

      if (slotTime)
        refDeliveryTimeList.current.changeValue(true, deliverySlotTime.indexOf(slotTime))
    }
    loadSavedStrings()
  }, [])

  useEffect(() => {
    if (!cartStore.hasItems) {
      console.log("to main screen")
      navigation.navigate("main")
    }
  }, [navigation])

  useEffect(() => {
    if (!modalStatePaymentCard.isVisible) {
      if (!isCardDataValid()) setIsPaymentCard(false)

      setCard(undefined)
    }
  }, [modalStatePaymentCard.isVisible])

  const onError: SubmitErrorHandler<any> = (errors) => {
    __DEV__ && console.log({ errors })
  }

  const onSubmit = async (data) => {
    Keyboard.dismiss()
    if (!dayStore.currentDay) {
      showMessageError("deliveryDetailScreen.errorDayDelivery", true)
      return
    }

    if (labelDeliveryTime.length === 0) {
      showMessageError("deliveryDetailScreen.errorTimeDelivery", true)
      return
    }

    if (isPaymentCard) {
      if (!isCardDataValid()) {
        showMessageError("deliveryDetailScreen.errorCard", true)
        return
      }
    }

    if (!isPaymentCard && !isPaymentCash) {
      showMessageError("deliveryDetailScreen.errorPayment", true)
      return
    }

    if (isPaymentCash) {
      setCard(undefined)
    }

    commonStore.setVisibleLoading(true)
    console.log("Submitted")
    const taxId = data.taxId?.length === 0 ? "CF" : data.taxId.toUpperCase()

    const order: Order = {
      id: 0,
      customerId: userStore.userId,
      address: `${addressStore.current.address}, ${addressStore.current.numHouseApartment}`,
      country: addressStore.current.country,
      city: addressStore.current.city,
      region: addressStore.current.region,
      products: getProducts(),
      priceDelivery: orderStore.priceDelivery,
      metaData: getMetaData(taxId),
      customerNote: data.customerNote,
      currencyCode: cartStore.cart[0]?.dish.chef.currencyCode,
      taxId: taxId,
      uuid: getUniqueId(),
      card: {
        cardNumber: encrypt(card.number.split(" ").join("")),
        dateExpiry: encrypt(card.expirationDate),
        cvv: encrypt(card.cvv),
        name: card.name,
        type: getCardType(card.number).toLocaleLowerCase(),
      },
      paymentMethod: isPaymentCash ? "cod" : "qpaypro", //Contra entrega o pago con tarjeta
    }

    orderStore
      .add(order)
      .then(async (res) => {
        commonStore.setVisibleLoading(false)
        __DEV__ && console.log("Code order reponse", res)
        if (Number(res.data) > 0) {
          await saveString("taxId", data.taxId)
          await saveString("customerNote", data.customerNote)
          await saveString("deliveryTime", labelDeliveryTime)

          __DEV__ && console.log("order added", res.data)
          navigation.navigate("endOrder", {
            orderId: Number(res.data),
            deliveryDate: dayStore.currentDay.dayName,
            deliveryTime: labelDeliveryTime,
            deliveryAddress: addressStore.current.address,
            imageChef: commonStore.currentChefImage,
          })
        } else if (Number(res.data) === -1)
          showMessageError(getI18nText("deliveryDetailScreen.errorOrderPayment"))
        else showMessageError(getI18nText("deliveryDetailScreen.errorOrder"))
      })
      .finally(() => commonStore.setVisibleLoading(false))

    __DEV__ && console.log(order)
  }

  const getProducts = (): Products[] => {
    return cartStore.cart.map((item) => {
      return {
        productId: item.dish.id,
        quantity: item.quantity,
        price: item.total,
        name: item.dish.title,
        noteChef: item.noteChef, // Nota que desea agregar al cliente para el chef
        metaData: item.metaData,
      }
    })
  }

  const isCardDataValid = () => {
    if (
      !card ||
      !card.cvv ||
      !card.expirationDate ||
      !card.number ||
      !card.name ||
      card.cvv.trim().length == 0 ||
      card.expirationDate.trim().length == 0 ||
      card.number.trim().length == 0 ||
      card.name.trim().length == 0
    )
      return false

    return true
  }

  const getMetaData = (taxId: string): MetaData[] => {
    const data: MetaData[] = []

    // Add chef id
    data.push({
      key: "_dokan_vendor_id",
      value: `${commonStore.currentChefId}`,
    })

    // Add delivery time
    data.push({
      key: "dokan_delivery_time_slot",
      value: `${labelDeliveryTime}`,
    })

    // Add delivery date
    data.push({
      key: "dokan_delivery_time_date",
      value: dayStore.currentDay.date,
    })

    // Add tax of the customer

    data.push({
      key: "_billing_taxid",
      value: taxId,
    })

    data.push({
      key: "billing_taxid",
      value: taxId,
    })

    return data
  }

  const getNameDayDelivery = (): string => {
    if (dayStore.currentDay.dayName.includes(" ")) return dayStore.currentDay.dayNameLong
    return `${dayStore.currentDay.dayName}  (${dayStore.currentDay.dayNameLong})`
  }

  return (
    <Screen style={styles.container} preset="fixed">
      <Header headerTx="deliveryDetailScreen.title" leftIcon="back" onLeftPress={goBack} />
      <ScrollView style={styles.containerForm}>
        <Text
          preset="bold"
          size="lg"
          tx="deliveryDetailScreen.info"
          style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
        ></Text>
        <FormProvider {...methods}>
          <TouchableOpacity activeOpacity={1} onPress={() => modalStateLocation.setVisible(true)}>
            <InputText
              onPressIn={() => modalStateLocation.setVisible(true)}
              name="address"
              preset="card"
              labelTx="deliveryDetailScreen.address"
              placeholderTx="deliveryDetailScreen.addressPlaceholder"
              editable={false}
              value={`${addressStore.current.name ?? ""} - ${addressStore.current.address}`}
              iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
            ></InputText>
          </TouchableOpacity>

          <InputText
            name="customerNote"
            preset="card"
            labelTx="deliveryDetailScreen.deliveryNote"
            placeholderTx="deliveryDetailScreen.deliveryNotePlaceholder"
            value={addressStore.current.instructionsDelivery}
          ></InputText>
          <Separator style={[utilSpacing.mt3, utilSpacing.mb5, utilSpacing.mx4]}></Separator>

          <TouchableOpacity activeOpacity={1} onPress={() => modalDelivery.setVisible(true)}>
            <InputText
              onPressIn={() => modalDelivery.setVisible(true)}
              name="diveryDate"
              preset="card"
              labelTx="deliveryDetailScreen.deliveryDate"
              placeholderTx="deliveryDetailScreen.deliveryDatePlaceholder"
              editable={false}
              value={getNameDayDelivery()}
              iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
            ></InputText>
          </TouchableOpacity>

          <Text
            preset="bold"
            style={[utilSpacing.mx4, utilSpacing.mb4, utilSpacing.mt5]}
            tx="deliveryDetailScreen.deliveryTime"
          ></Text>
          <DeliveryTimeList
            ref={refDeliveryTimeList}
            onSelectItem={(value) => setLabelDeliveryTime(value)}
          ></DeliveryTimeList>
          <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
          <Text
            preset="bold"
            size="lg"
            tx="deliveryDetailScreen.paymentMethod"
            style={[utilSpacing.mb2, utilSpacing.mx4]}
          ></Text>

          <Card style={[utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => {
                modalStatePaymentCard.setVisible(true)
                setIsPaymentCard(!isPaymentCard)
                setIsPaymentCash(false)
              }}
              style={[utilSpacing.p2, utilFlex.flexRow, utilFlex.flexCenterVertical]}
            >
              <Checkbox
                rounded
                style={[utilSpacing.px3, utilFlex.flex1]}
                value={isPaymentCard}
                preset="medium"
                tx="deliveryDetailScreen.paymentCard"
              ></Checkbox>
              <View style={[utilSpacing.mr4, utilFlex.flexRow]}>
                <Image style={styles.imageCard} source={images.cardVisa}></Image>
                <Image style={styles.imageCard} source={images.cardMastercard}></Image>
                <Image style={styles.imageCard} source={images.cardAmex}></Image>
              </View>
            </Ripple>
          </Card>

          <Card style={[utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => {
                setIsPaymentCash(!isPaymentCash)
                setIsPaymentCard(false)
                refModalPaymentCard.current?.cleanInputs()
              }}
              style={[utilSpacing.p2, utilFlex.flexRow, utilFlex.flexCenterVertical]}
            >
              <Checkbox
                rounded
                style={[utilSpacing.px3, utilFlex.flex1]}
                value={isPaymentCash}
                preset="medium"
                tx="deliveryDetailScreen.paymentCash"
              ></Checkbox>
            </Ripple>
          </Card>

          <InputText
            name="taxId"
            preset="card"
            placeholderTx="deliveryDetailScreen.nitPlaceholder"
            labelTx="deliveryDetailScreen.nit"
            styleContainer={[utilSpacing.my3]}
            maxLength={100}
          ></InputText>
        </FormProvider>

        <View style={utilSpacing.mx4}>
          <Separator style={utilSpacing.my6}></Separator>
          <View style={utilFlex.flexRow}>
            <Text
              style={utilSpacing.mr2}
              preset="semiBold"
              tx="deliveryDetailScreen.delivery"
            ></Text>
            <Text
              preset="semiBold"
              caption
              text={`${getNameDayDelivery()} ${labelDeliveryTime}`}
              style={utilSpacing.mb6}
            ></Text>
          </View>

          {/* Resume order */}
          <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
            <DishesList></DishesList>
            <Separator style={styles.separator}></Separator>
            <Totals></Totals>
          </Card>
        </View>
      </ScrollView>
      <ButtonFooter
        onPress={methods.handleSubmit(onSubmit, onError)}
        text={`${getI18nText("dishDetailScreen.pay")} ${getFormat(
          cartStore.subtotal + orderStore.priceDelivery,
          cartStore.cart[0]?.dish.chef.currencyCode,
        )}`}
      ></ButtonFooter>

      <ModalLocation screenToReturn={"deliveryDetail"} modal={modalStateLocation}></ModalLocation>
      <ModalDeliveryDate modal={modalDelivery}></ModalDeliveryDate>
      <ModalPaymentCard
        ref={refModalPaymentCard}
        modalState={modalStatePaymentCard}
        onSubmit={(values) => {
          setCard(values)
          setIsPaymentCard(true)
        }}
      ></ModalPaymentCard>
    </Screen>
  )
})

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerForm: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "90%",
  },
  imageCard: {
    borderRadius: spacing[1],
    height: 24,
    marginLeft: spacing[1],
    width: 35,
  },

  price: {
    backgroundColor: color.transparent,
  },
  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
})
