import React, { FC, useEffect, useRef, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { getUniqueId } from "react-native-device-info"
import { AppEventsLogger } from "react-native-fbsdk-next"
import Ripple from "react-native-material-ripple"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import {
  ButtonFooter,
  Card,
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
import { TxKeyPath } from "../../i18n"
import { Coupon, MetaData, Order, Products, useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { palette } from "../../theme/palette"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { getImageByTypeCard } from "../../utils/image"
import { ModalStateHandler } from "../../utils/modalState"
import { getFormat } from "../../utils/price"
import { loadString, saveString } from "../../utils/storage"
import { getI18nText } from "../../utils/translate"

import { deliverySlotTime, DeliveryTimeList } from "./delivery-time-list"
import { DishesList } from "./dishes-list"
import { ModalCoupon } from "./modal-coupon"
import { ModalPaymentList } from "./modal-payment-list"
import { Totals } from "./totals"

const modalStateLocation = new ModalStateHandler()
const modalDelivery = new ModalStateHandler()
const modalStateCoupon = new ModalStateHandler()
const modalStatePaymentList = new ModalStateHandler()

export const CheckoutScreen: FC<StackScreenProps<NavigatorParamList, "checkout">> = observer(
  ({ navigation }) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const {
      addressStore,
      dayStore,
      cartStore,
      userStore,
      commonStore,
      orderStore,
      messagesStore,
      deliveryStore,
    } = useStores()
    const [labelDeliveryTime, setLabelDeliveryTime] = useState("")

    const refDeliveryTimeList = useRef(null)
    const [coupon, setCoupon] = useState<Coupon>()

    useEffect(() => {
      cartStore.setDiscount(0)
      const loadSavedStrings = async () => {
        const taxId = await loadString("taxId")
        const deliveryTime = await loadString("deliveryTime")
        const customerNote = await loadString("customerNote")
        methods.setValue("taxId", taxId ?? "")
        methods.setValue("deliveryNote", customerNote ?? "")
        setLabelDeliveryTime(deliveryTime ?? "")

        const slotTime = deliverySlotTime.find((slotTime) => slotTime.label === deliveryTime)

        if (slotTime)
          refDeliveryTimeList.current?.changeValue(true, deliverySlotTime.indexOf(slotTime))
      }
      loadSavedStrings()

      AppEventsLogger.logEvent("IntoCheckout", 1, {
        description: "El usuario entró en la pantalla del checkout",
      })
    }, [])

    useEffect(() => {
      if (!cartStore.hasItems) {
        console.log("to main screen")
        navigation.navigate("main")
      }
    }, [navigation])

    const getCardId = () => {
      if (userStore.currentCard?.id > 0) return userStore.currentCard?.id

      return null
    }

    const onError: SubmitErrorHandler<any> = (errors) => {
      __DEV__ && console.log({ errors })
    }

    const onSubmit = async (data) => {
      Keyboard.dismiss()
      if (!dayStore.currentDay) {
        messagesStore.showError("checkoutScreen.errorDayDelivery" as TxKeyPath, true)
        return
      }

      if (labelDeliveryTime.length === 0) {
        messagesStore.showError("checkoutScreen.errorTimeDelivery" as TxKeyPath, true)
        return
      }

      commonStore.setVisibleLoading(true)
      const taxId = data.taxId?.trim().length === 0 ? "CF" : data.taxId.toUpperCase()

      const order: Order = {
        id: 0,
        customerId: userStore.userId,
        address: `${addressStore.current.address}, ${addressStore.current.numHouseApartment}`,
        country: addressStore.current.country,
        city: addressStore.current.city,
        region: addressStore.current.region,
        products: getProducts(),
        priceDelivery: deliveryStore.priceDelivery,
        metaData: getMetaData(taxId),
        customerNote: data.customerNote,
        currencyCode: cartStore.cart[0]?.dish.chef.currencyCode,
        taxId: taxId,
        uuid: getUniqueId(),
        cardId: getCardId(),
        paymentMethod: getCardId() ? "qpaypro" : "cod", // Contra entrega o pago con tarjeta
        couponCode: coupon?.code,
      }

      orderStore
        .add(order)
        .then(async (res) => {
          commonStore.setVisibleLoading(false)
          __DEV__ && console.log("Code order reponse", res)

          if (!res) {
            messagesStore.showError("checkoutScreen.errorOrder", true)
            return
          }

          if (Number(res.data) > 0) {
            await saveString("taxId", data.taxId)
            await saveString("customerNote", data.customerNote)
            await saveString("deliveryTime", labelDeliveryTime)
            cartStore.setDiscount(0)
            __DEV__ && console.log("order added", res.data)

            AppEventsLogger.logPurchase(getCurrentTotal(), getCurrency(), {
              description: "El usuario ha realizado un pedido",
            })

            navigation.navigate("endOrder", {
              orderId: Number(res.data),
              deliveryDate: dayStore.currentDay.dayName,
              deliveryTime: labelDeliveryTime,
              deliveryAddress: addressStore.current.address,
              imageChef: commonStore.currentChefImage,
            })
          } else if (Number(res.data) === -1)
            messagesStore.showError("checkoutScreen.errorOrderPayment", true)
          else messagesStore.showError("checkoutScreen.errorOrder", true)
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
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
          noteChef: item.noteChef, // Nota que desea agregar el cliente para el chef
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

      data.push({
        key: "customer_address_id",
        value: `${userStore.addressId}`,
      })

      return data
    }

    const getNameDayDelivery = (): string => {
      if (dayStore.currentDay.dayName.includes(" ")) return dayStore.currentDay.dayNameLong

      return `${dayStore.currentDay.dayName}  (${dayStore.currentDay.dayNameLong})`
    }

    const getTextButtonFooter = (): string => {
      const text = getI18nText(getCardId() ? "checkoutScreen.pay" : "checkoutScreen.makeOrder")
      return `${text} ${getFormat(getCurrentTotal(), getCurrency())}`
    }

    const getCurrentTotal = (): number => {
      return cartStore.subtotal + deliveryStore.priceDelivery - (cartStore.discount ?? 0)
    }

    const getCurrency = (): string => {
      return cartStore.cart[0]?.dish.chef.currencyCode
    }

    const getAddressText = (): string => {
      const address = ""
      if (addressStore.current.name && addressStore.current.name.trim().length > 0)
        address.concat(" - ")
      return address.concat(addressStore.current.address)
    }

    return (
      <Screen
        preset="fixed"
        statusBarBackgroundColor={
          modalStatePaymentList.isVisible ? color.palette.white : color.primary
        }
        statusBar={modalStatePaymentList.isVisible ? "dark-content" : "light-content"}
      >
        <Header headerTx="checkoutScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView style={[styles.containerForm, utilSpacing.px3]}>
          <Text
            preset="bold"
            size="lg"
            tx="checkoutScreen.info"
            style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
          ></Text>
          <FormProvider {...methods}>
            <TouchableOpacity activeOpacity={1} onPress={() => modalStateLocation.setVisible(true)}>
              <InputText
                name="address"
                preset="card"
                labelTx="checkoutScreen.address"
                placeholderTx="checkoutScreen.addressPlaceholder"
                editable={false}
                value={getAddressText()}
                iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
              ></InputText>
            </TouchableOpacity>

            <InputText
              name="customerNote"
              preset="card"
              labelTx="checkoutScreen.deliveryNote"
              placeholderTx="checkoutScreen.deliveryNotePlaceholder"
              value={addressStore.current.instructionsDelivery}
            ></InputText>
            <Separator style={[utilSpacing.mt3, utilSpacing.mb5, utilSpacing.mx4]}></Separator>

            <TouchableOpacity activeOpacity={1} onPress={() => modalDelivery.setVisible(true)}>
              <InputText
                name="diveryDate"
                preset="card"
                labelTx="checkoutScreen.deliveryDate"
                placeholderTx="checkoutScreen.deliveryDatePlaceholder"
                editable={false}
                value={getNameDayDelivery()}
                iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
              ></InputText>
            </TouchableOpacity>

            <Text
              preset="bold"
              style={[utilSpacing.mx4, utilSpacing.mb4, utilSpacing.mt5]}
              tx="checkoutScreen.deliveryTime"
            ></Text>
            <DeliveryTimeList
              ref={refDeliveryTimeList}
              onSelectItem={(value) => setLabelDeliveryTime(value)}
            ></DeliveryTimeList>
            <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
            <Text
              preset="bold"
              size="lg"
              tx="checkoutScreen.paymentMethod"
              style={[utilSpacing.mb2, utilSpacing.mx4]}
            ></Text>

            <Card
              style={[styles.containerPayment, utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]}
            >
              {userStore.currentCard?.id > 0 ? (
                <Ripple
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  onPress={() => {
                    modalStatePaymentList.setVisible(true)
                  }}
                  style={[utilSpacing.p2, utilFlex.flexRow, utilFlex.flexCenterVertical]}
                >
                  <View style={[utilFlex.flex1, utilSpacing.ml4]}>
                    <Text text={userStore.currentCard.name} preset="semiBold"></Text>
                    <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                      <Text
                        text="****"
                        caption
                        size="sm"
                        style={[utilSpacing.mt2, utilSpacing.mr2]}
                      ></Text>

                      <Text text={userStore.currentCard.number} caption size="sm"></Text>
                    </View>
                  </View>

                  <Image
                    style={[styles.imageCard, utilSpacing.mr4]}
                    source={getImageByTypeCard(userStore.currentCard.type as never)}
                  ></Image>
                  <TouchableOpacity style={[utilSpacing.px4, utilSpacing.py3, utilSpacing.mr3]}>
                    <Icon name="angle-right" size={18} color={color.palette.grayDark} />
                  </TouchableOpacity>
                </Ripple>
              ) : (
                <Ripple
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  onPress={() => {
                    modalStatePaymentList.setVisible(true)
                  }}
                  style={[utilSpacing.p2, utilFlex.flexRow, utilFlex.flexCenterVertical]}
                >
                  <View style={[utilFlex.flex1, utilSpacing.ml4]}>
                    <View style={utilFlex.felxColumn}>
                      <Text tx="checkoutScreen.paymentCash" preset="semiBold"></Text>
                      <Text tx="checkoutScreen.paymentCashDescription" caption size="sm"></Text>
                    </View>
                  </View>

                  <Image style={[styles.imageCard, utilSpacing.mr4]} source={images.cash}></Image>
                  <TouchableOpacity style={[utilSpacing.px4, utilSpacing.py3, utilSpacing.mr3]}>
                    <Icon name="angle-right" size={18} color={color.palette.grayDark} />
                  </TouchableOpacity>
                </Ripple>
              )}
            </Card>

            <InputText
              name="taxId"
              preset="card"
              placeholderTx="checkoutScreen.nitPlaceholder"
              labelTx="checkoutScreen.nit"
              styleContainer={[utilSpacing.my3]}
              maxLength={100}
            ></InputText>

            <Ripple
              style={[utilSpacing.my5, utilFlex.selfCenter]}
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => modalStateCoupon.setVisible(true)}
            >
              <Card style={[utilSpacing.px6, utilSpacing.p4]}>
                <View style={[utilSpacing.p3, utilFlex.flexRow, utilFlex.flexCenter]}>
                  <Icon name="tag" size={26} color={color.text}></Icon>
                  <Text size="lg" style={utilSpacing.ml3} tx="checkoutScreen.useCoupon"></Text>
                </View>
              </Card>
            </Ripple>
          </FormProvider>

          <View style={utilSpacing.mx4}>
            <Separator style={utilSpacing.my6}></Separator>
            <View style={utilFlex.flexRow}>
              <Text style={utilSpacing.mr2} preset="semiBold" tx="checkoutScreen.delivery"></Text>
              <Text
                preset="semiBold"
                caption
                text={`${getNameDayDelivery()} ${labelDeliveryTime}`}
                style={[utilSpacing.mb6, utilFlex.flex1]}
              ></Text>
            </View>

            {/* Resume order */}
            <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
              <DishesList></DishesList>
              <Separator style={styles.separator}></Separator>
              <Totals coupon={coupon}></Totals>
            </Card>
          </View>
        </ScrollView>

        {cartStore.hasItems && (
          <ButtonFooter
            onPress={methods.handleSubmit(onSubmit, onError)}
            text={getTextButtonFooter()}
          ></ButtonFooter>
        )}

        <ModalLocation screenToReturn={"checkout"} modal={modalStateLocation}></ModalLocation>
        <ModalDeliveryDate modal={modalDelivery}></ModalDeliveryDate>
        <ModalCoupon stateModal={modalStateCoupon} onUseCoupon={setCoupon}></ModalCoupon>
        <ModalPaymentList stateModal={modalStatePaymentList}></ModalPaymentList>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  btnChange: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: spacing[2],
  },
  containerForm: {
    minWidth: 300,
  },

  containerPayment: {
    borderColor: palette.whiteGray,
    borderWidth: 1,
  },
  coupon: {
    maxWidth: 230,
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
