import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { getUniqueId } from "react-native-device-info"
import images from "../../assets/images"
import {
  AutoImage,
  ButtonFooter,
  Card,
  Header,
  InputText,
  Loader,
  ModalDeliveryDate,
  PaymentCard,
  Screen,
  Separator,
  Text,
} from "../../components"
import { LocationModal } from "../../components/location/location-modal"
import { MetaData, Order, Products, useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { getCardType } from "../../utils/card"
import { getCountryCode, getCurrencyCode } from "../../utils/location"
import { showMessageError } from "../../utils/messages"
import { getFormat } from "../../utils/price"
import { loadString, saveString } from "../../utils/storage"
import { getI18nText } from "../../utils/translate"
import { deliverySlotTime, DeliveryTimeList } from "./delivery-time-list"
import { DishesList } from "./dishes-list"
import { Totals } from "./totals"

class ModalState {
  isVisibleLocation = false

  setVisibleLocation(state: boolean) {
    this.isVisibleLocation = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

class ModalDelivery {
  isVisible = false

  setVisible(state: boolean) {
    this.isVisible = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const modalState = new ModalState()
const modalDelivery = new ModalDelivery()

export const DeliveryDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "deliveryDetail">
> = observer(({ navigation }) => {
  const { ...methods } = useForm({ mode: "onBlur" })
  const { addressStore, dayStore, cartStore, userStore, commonStore, orderStore } = useStores()
  const [labelDeliveryTime, setLabelDeliveryTime] = useState("")
  const refDeliveryTimeList = useRef(null)

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

  const onError: SubmitErrorHandler<any> = (errors) => {
    return console.log({ errors })
  }

  const onSubmit = async (data) => {
    Keyboard.dismiss()
    if (!dayStore.currentDay) {
      showMessageError(getI18nText("deliveryDetailScreen.errorDayDelivery"))
      return
    }

    if (labelDeliveryTime.length === 0) {
      showMessageError(getI18nText("deliveryDetailScreen.errorTimeDelivery"))
      return
    }

    const countryCode = await getCountryCode()
    const currencyCode = getCurrencyCode(countryCode)

    const taxId = data.taxId?.length === 0 ? "CF" : data.taxId

    const order: Order = {
      id: 0,
      customerId: userStore.userId,
      address: addressStore.current.address,
      country: addressStore.current.country,
      city: addressStore.current.city,
      region: addressStore.current.address,
      products: getProducts(),
      priceDelivery: 20,
      metaData: getMetaData(taxId),
      customerNote: data.customerNote,
      currencyCode: currencyCode,
      taxId: taxId,
      uuid: getUniqueId(),
      card: {
        cardNumber: data.number.split(" ").join(""),
        dateExpiry: data.expirationDate,
        cvv: data.cvv,
        name: data.name,
        type: getCardType(data.number).toLocaleLowerCase(),
      },
    }
    commonStore.setVisibleLoading(true)
    orderStore
      .add(order)
      .then(async (res) => {
        commonStore.setVisibleLoading(false)
        console.log("Code order reponse", res)
        if (Number(res.data) > 0) {
          await saveString("taxId", data.taxId)
          await saveString("customerNote", data.customerNote)
          await saveString("deliveryTime", labelDeliveryTime)

          console.log("order added", res.data)
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

    console.log(order)
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

  return (
    <Screen style={styles.container} preset="fixed">
      <Header headerTx="deliveryDetailScreen.title" leftIcon="back" onLeftPress={goBack} />
      <ScrollView style={styles.containerForm}>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.info"
          style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
        ></Text>
        <FormProvider {...methods}>
          <TouchableOpacity activeOpacity={1} onPress={() => modalState.setVisibleLocation(true)}>
            <InputText
              name="address"
              preset="card"
              labelTx="deliveryDetailScreen.address"
              placeholderTx="deliveryDetailScreen.addressPlaceholder"
              editable={false}
              value={`${addressStore.current.name} - ${addressStore.current.address}`}
            ></InputText>
          </TouchableOpacity>

          <InputText
            name="customerNote"
            preset="card"
            labelTx="deliveryDetailScreen.deliveryNote"
            placeholderTx="deliveryDetailScreen.deliveryNotePlaceholder"
          ></InputText>
          <Separator style={[utilSpacing.mt3, utilSpacing.mb5, utilSpacing.mx4]}></Separator>

          <TouchableOpacity activeOpacity={1} onPress={() => modalDelivery.setVisible(true)}>
            <InputText
              name="diveryDate"
              preset="card"
              labelTx="deliveryDetailScreen.deliveryDate"
              placeholderTx="deliveryDetailScreen.deliveryDatePlaceholder"
              editable={false}
              value={dayStore.currentDay.dayName}
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
          <View style={utilFlex.flexRow}>
            <Text
              preset="bold"
              caption
              tx="deliveryDetailScreen.paymentCard"
              style={[utilSpacing.mb4, utilSpacing.ml4, utilFlex.flex1]}
            ></Text>
            <View style={[utilSpacing.mr4, utilFlex.flexRow]}>
              <AutoImage style={styles.imageCard} source={images.cardAmex}></AutoImage>
              <AutoImage style={styles.imageCard} source={images.cardMastercard}></AutoImage>
              <AutoImage style={styles.imageCard} source={images.cardVisa}></AutoImage>
            </View>
          </View>

          <PaymentCard methods={methods}></PaymentCard>
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
              text={`${dayStore.currentDay.dayName} ${labelDeliveryTime}`}
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
        text={`${getI18nText("dishDetailScreen.pay")} ${getFormat(cartStore.subtotal + 20)}`}
      ></ButtonFooter>

      <LocationModal screenToReturn={"deliveryDetail"} modal={modalState}></LocationModal>
      <ModalDeliveryDate modal={modalDelivery}></ModalDeliveryDate>
      <Loader></Loader>
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
    borderColor: color.palette.grayLigth,
    borderRadius: spacing[1],
    borderWidth: 1,
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
