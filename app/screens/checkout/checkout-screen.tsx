import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { getUniqueId, getVersion } from "react-native-device-info"
import { AppEventsLogger } from "react-native-fbsdk-next"
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

import RNUxcam from "react-native-ux-cam"
import { MEXICO } from "../../utils/constants"
import DeliveryLabel from "./delivery-label"
import { DeliveryTimeList } from "./delivery-time-list"
import { ModalCoupon } from "./modal-coupon"
import { ModalPaymentList } from "./modal-payment-list"
import Summary from "./summay"

const modalStateLocation = new ModalStateHandler()
const modalDelivery = new ModalStateHandler()
const modalStateCoupon = new ModalStateHandler()
const modalStatePaymentList = new ModalStateHandler()

export const CheckoutScreen: FC<StackScreenProps<NavigatorParamList, "checkout">> = observer(
  ({ navigation, route: { params } }) => {
    const { ...methods } = useForm({ mode: "onBlur" })

    const [subscription, setSubscription] = useState(false)
    const isPlan = params?.isPlan
    const {
      addressStore,
      dayStore,
      cartStore,
      userStore,
      commonStore,
      orderStore,
      messagesStore,
      plansStore,
    } = useStores()
    const [labelDeliveryTime, setLabelDeliveryTime] = useState("")

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
      }
      loadSavedStrings()

      AppEventsLogger.logEvent("IntoCheckout", 1, {
        description: "El usuario entró en la pantalla del checkout",
      })

      RNUxcam.logEvent("checkout")
    }, [])

    useEffect(() => {
      if (!cartStore.hasItems && !isPlan) {
        console.log("to main screen")
        navigation.navigate("main")
      }
    }, [navigation])

    const getPaymentMethodId = () => {
      if (userStore.currentCard?.id) return userStore.currentCard?.id

      return null
    }

    const getAddressLabel = () => {
      let label = addressStore.current.address

      if (addressStore.current.numHouseApartment) {
        label += `, ${addressStore.current.numHouseApartment}`
      }

      return label
    }
    const onError: SubmitErrorHandler<any> = (errors) => {
      RNUxcam.logEvent("checkout: errorSubmit", { errors })
      __DEV__ && console.log({ errors })
    }

    const sendOrder = (data) => {
      if (isPlan) {
        createOrderPlan()
      } else {
        createOrderDish(data)
      }
    }

    const getDatesDelivery = () => {
      const dates = []

      cartStore.cartPlans.forEach((item) => {
        dates.push(item.dateShortName)
      })

      const uniqueDates = dates.filter(
        (item, index, self) => index === self.findIndex((t) => t === item),
      )

      return uniqueDates.join(", ")
    }

    const createOrderPlan = () => {
      commonStore.setVisibleLoading(true)

      setTimeout(() => {
        commonStore.setVisibleLoading(false)
        navigation.navigate("endOrder", {
          orderId: 0,
          deliveryDate: getDatesDelivery(),
          deliveryTime: "Las entregas son de 10 AM a 1 PM",
          deliveryAddress: addressStore.current.address,
          imageChef:
            "https://kaserafood.com/wp-content/uploads/2022/02/cropped-WhatsApp-Image-2022-02-07-at-3.38.55-PM-min.jpeg",
          isPlan: true,
        })
      }, 1500)
    }

    const createOrderDish = async (data) => {
      Keyboard.dismiss()
      if (!dayStore.currentDay) {
        messagesStore.showError("checkoutScreen.errorDayDelivery" as TxKeyPath, true)
        RNUxcam.logEvent("checkout: errorDayDelivery")
        return
      }

      if (labelDeliveryTime.length === 0 && !isPlan) {
        messagesStore.showError("checkoutScreen.errorTimeDelivery" as TxKeyPath, true)
        RNUxcam.logEvent("checkout: errorTimeDelivery")
        return
      }

      commonStore.setVisibleLoading(true)
      const taxId = data.taxId?.trim().length === 0 ? "CF" : data.taxId.toUpperCase()

      const order: Order = {
        id: 0,
        customerId: userStore.userId,
        address: getAddressLabel(),
        country: addressStore.current.country,
        city: addressStore.current.city,
        region: addressStore.current.region,
        products: getProducts(),
        priceDelivery: priceDelivery(),
        metaData: getMetaData(taxId),
        customerNote: data.customerNote,
        currencyCode: cartStore.cart[0]?.dish.chef.currencyCode,
        taxId: taxId,
        uuid: getUniqueId(),
        paymentMethodId: getPaymentMethodId(),
        paymentMethod: getPaymentMethodId() ? "card" : "cod", // Contra entrega o pago con tarjeta
        couponCode: coupon?.code,
        total: getCurrentTotal(),
      }

      orderStore
        .add(order)
        .then(async (res) => {
          commonStore.setVisibleLoading(false)
          __DEV__ && console.log("Code order reponse", res)

          if (!res) {
            messagesStore.showError("checkoutScreen.errorOrder", true)
            RNUxcam.logEvent("checkout: errorOrder")
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

            RNUxcam.logEvent("checkout: successOrder")

            navigation.navigate("endOrder", {
              orderId: Number(res.data),
              deliveryDate: dayStore.currentDay.dayName,
              deliveryTime: labelDeliveryTime,
              deliveryAddress: addressStore.current.address,
              imageChef: commonStore.currentChefImage,
            })
          } else if (Number(res.data) === -1) {
            messagesStore.showError("checkoutScreen.errorOrderPayment", true)
            RNUxcam.logEvent("checkout: errorOrderPayment")
          } else {
            RNUxcam.logEvent("checkout: errorOrder")
            messagesStore.showError("checkoutScreen.errorOrder", true)
          }
        })
        .catch((error: Error) => {
          RNUxcam.logEvent("checkout: ERROR CRITICAL")
          messagesStore.showError(error.message)
        })
        .finally(() => commonStore.setVisibleLoading(false))

      __DEV__ && console.log(order)
    }

    const getProducts = (): Products[] => {
      return cartStore.cart.map((item) => ({
        productId: item.dish.id,
        quantity: item.quantity,
        price: item.total,
        name: item.dish.title,
        noteChef: item.noteChef, // Nota que desea agregar el cliente para el chef
        metaData: item.metaData,
      }))
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

      data.push({
        key: "device_type",
        value: Platform.OS,
      })

      data.push({
        key: "app_version",
        value: getVersion(),
      })

      return data
    }

    const getNameDayDelivery = (): string => {
      if (dayStore.currentDay.dayName.includes(" ")) return dayStore.currentDay.dayNameLong

      return `${dayStore.currentDay.dayName}  (${dayStore.currentDay.dayNameLong})`
    }

    const getTextButtonFooter = (): string => {
      if (isPlan) {
        return `${getI18nText("checkoutScreen.pay")} ${`${commonStore.currency  } ${  plansStore.price}`}`
      }
      const text = getI18nText(
        getPaymentMethodId() ? "checkoutScreen.pay" : "checkoutScreen.makeOrder",
      )
      return `${text} ${getFormat(getCurrentTotal(), getCurrency())}`
    }

    const getCurrentTotal = (): number => {
      return cartStore.subtotal + priceDelivery() - (cartStore.discount ?? 0)
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

    const onPressAddress = () => {
      console.log("on press address")
      modalStateLocation.setVisible(true)
      RNUxcam.logEvent("checkout: onPressAddress")
    }

    const onPressCoupon = () => {
      modalStateCoupon.setVisible(true)
      RNUxcam.logEvent("checkout: onPressCoupon")
    }

    const priceDelivery = () => {
      if (cartStore.cart.length === 0) return 0
      return cartStore.cart[0]?.dish.chef.priceDelivery
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
            <Ripple rippleOpacity={0.2} rippleDuration={400} onPress={onPressAddress}>
              <InputText
                name="address"
                preset="card"
                labelTx="checkoutScreen.address"
                placeholderTx="checkoutScreen.addressPlaceholder"
                editable={false}
                value={getAddressText()}
                iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
              ></InputText>
            </Ripple>

            <InputText
              name="customerNote"
              preset="card"
              labelTx="checkoutScreen.deliveryNote"
              placeholderTx="checkoutScreen.deliveryNotePlaceholder"
              value={addressStore.current.instructionsDelivery}
            ></InputText>

            {!params?.isPlan && (
              <View>
                <Ripple
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  onPress={() => modalDelivery.setVisible(true)}
                >
                  <InputText
                    name="diveryDate"
                    preset="card"
                    labelTx="checkoutScreen.deliveryDate"
                    placeholderTx="checkoutScreen.deliveryDatePlaceholder"
                    editable={false}
                    value={getNameDayDelivery()}
                    iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
                  ></InputText>
                </Ripple>

                <DeliveryTimeList
                  onSelectItem={(value) => setLabelDeliveryTime(value)}
                  chefId={commonStore.currentChefId}
                ></DeliveryTimeList>
              </View>
            )}

            <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
            <Text
              preset="bold"
              size="lg"
              tx="checkoutScreen.paymentMethod"
              style={[utilSpacing.mb2, utilSpacing.mx4]}
            ></Text>

            <Card
              style={[styles.containerPayment, utilSpacing.m4, utilSpacing.px1, utilSpacing.p0]}
            >
              {userStore.currentCard?.id ? (
                <Ripple
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  onPress={() => {
                    modalStatePaymentList.setVisible(true)
                  }}
                  style={[
                    utilSpacing.p2,
                    utilSpacing.py3,
                    utilFlex.flexRow,
                    utilFlex.flexCenterVertical,
                  ]}
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
                  style={[
                    utilSpacing.p2,
                    utilSpacing.py3,
                    utilFlex.flexRow,
                    utilFlex.flexCenterVertical,
                  ]}
                >
                  <View style={[utilFlex.flex1, utilSpacing.ml4]}>
                    <View style={utilFlex.felxColumn}>
                      <Text
                        tx="checkoutScreen.paymentCash"
                        preset="semiBold"
                        style={utilSpacing.mb1}
                      ></Text>
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

            {isPlan && !!userStore?.currentCard?.id && (
              <Card
                style={[styles.paymentAutomatic, utilSpacing.mb4, utilSpacing.p0, utilSpacing.mx4]}
              >
                <Ripple
                  style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.p3]}
                  onPress={() => setSubscription(!subscription)}
                >
                  <View>
                    <Checkbox
                      rounded
                      value={subscription}
                      preset="default"
                      onToggle={setSubscription}
                    ></Checkbox>
                  </View>

                  <View style={utilFlex.flex1}>
                    <Text
                      tx="checkoutScreen.paymentAutomatic"
                      preset="semiBold"
                      size="md"
                      style={utilSpacing.mb1}
                    ></Text>
                    <Text>
                      <Text tx="checkoutScreen.paymentAutomaticDescription.part1"></Text>
                      <Text text="18 de agosto" preset="semiBold"></Text>
                      <Text tx="checkoutScreen.paymentAutomaticDescription.part2"></Text>
                    </Text>
                  </View>
                </Ripple>
              </Card>
            )}

            <InputText
              name="taxId"
              preset="card"
              placeholderTx={
                userStore.countryId === MEXICO
                  ? "checkoutScreen.rfcPlaceholder"
                  : "checkoutScreen.nitPlaceholder"
              }
              labelTx={userStore.countryId === MEXICO ? "checkoutScreen.rfc" : "checkoutScreen.nit"}
              styleContainer={[utilSpacing.my3]}
              maxLength={100}
            ></InputText>

            <Ripple
              style={[utilSpacing.my5, utilFlex.selfCenter]}
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={onPressCoupon}
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
            <DeliveryLabel labelDeliveryTime={labelDeliveryTime} isPlan={isPlan}></DeliveryLabel>

            {/* Resume order */}
            <Summary priceDelivery={priceDelivery()} coupon={coupon} isPlan={isPlan}></Summary>
          </View>
        </ScrollView>

        {(cartStore.hasItems || isPlan) && (
          <ButtonFooter
            onPress={methods.handleSubmit(sendOrder, onError)}
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
    borderColor: palette.green,
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
  // eslint-disable-next-line react-native/no-color-literals
  paymentAutomatic: {
    backgroundColor: "#eefcf6",
    borderColor: color.palette.green,
    borderRadius: spacing[2],
    borderWidth: 1,
    ...SHADOW,
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
