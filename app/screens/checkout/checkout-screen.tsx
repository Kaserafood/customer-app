import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, Platform, ScrollView, StyleSheet, View } from "react-native"
import { getUniqueId, getVersion } from "react-native-device-info"
import { AppEventsLogger } from "react-native-fbsdk-next"
import Ripple from "react-native-material-ripple"

import {
  Button,
  ButtonFooter,
  Card,
  Header,
  Icon,
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
import { ModalStateHandler } from "../../utils/modalState"
import { getFormat } from "../../utils/price"
import { loadString, saveString } from "../../utils/storage"
import { getI18nText } from "../../utils/translate"

import * as RNLocalize from "react-native-localize"
import OneSignal from "react-native-onesignal"
import RNUxcam from "react-native-ux-cam"
import { useMutation } from "react-query"
import { Api, OrderPlanRequest } from "../../services/api"
import { MEXICO } from "../../utils/constants"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import DeliveryLabel from "./delivery-label"
import { DeliveryTimeList } from "./delivery-time-list"
import ModalAddressFields from "./modal-address-fields"
import { ModalCoupon } from "./modal-coupon"
import { ModalPaymentList } from "./modal-payment-list"
import SelectPaymentMethod from "./select-payment-mehtod"
import Summary from "./summay"

const modalStateLocation = new ModalStateHandler()
const modalDelivery = new ModalStateHandler()
const modalStateCoupon = new ModalStateHandler()
const modalStatePaymentList = new ModalStateHandler()
const modalAddressFields = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()

export const CheckoutScreen: FC<StackScreenProps<NavigatorParamList, "checkout">> = observer(
  ({ navigation, route: { params } }) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const api = new Api()
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
    const [currentAddressData, setCurrentAddressData] = useState({
      name: "",
      numHouseApartment: "",
      phone: "",
    })

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
      mixpanel.track("Checkout Screen")
    }, [])

    useEffect(() => {
      if (!cartStore.hasItems && !isPlan) {
        console.log("to main screen")
        navigation.navigate("main")
      }

      if (!(userStore.userId > 0)) {
        OneSignal.getTags((tags) => {
          if (tags && tags.chefId) {
            navigation.navigate("menuChef", { id: tags.chefId, showModalCart: true } as any)
          }
        })
      }
    }, [navigation])

    const { mutate: createOrderPlan } = useMutation(
      (data: OrderPlanRequest) => api.createOrderPlan(data),
      {
        onSuccess: async (res) => {
          const planId = Number(res.data.value)
          if (planId > 0) {
            plansStore.setConsumedCredits(cartStore.useCredits + plansStore.consumedCredits)

            plansStore.setId(Number(res.data.value))

            // Update values of plan
            const account: any = await api.getAccount(userStore.userId, RNLocalize.getTimeZone())

            if (account.data) {
              plansStore.setPlan(account.data.plan)
            }

            navigation.navigate("endOrder", {
              orderId: 0,
              deliveryDate: getDatesDelivery(),
              deliveryTime: getI18nText("checkoutScreen.deliveryTimePlan"),
              deliveryAddress: addressStore.current.address,
              imageChef:
                "https://kaserafood.com/wp-content/uploads/2023/10/cropped-24800e3b-125b-4a03-a86f-5db969f56db7-e1696618503955-1.jpg",
              isPlan: true,
            })
          } else if (planId === -1) {
            messagesStore.showError("checkoutScreen.errorOrderPayment", true)
            RNUxcam.logEvent("checkout: errorOrderPayment")
            mixpanel.track("Checkout: Error on plan order payment")
          } else {
            RNUxcam.logEvent("checkout: errorOrder")
            mixpanel.track("Checkout: Error on plan order")
            messagesStore.showError("checkoutScreen.errorOrder", true)
          }
          commonStore.setVisibleLoading(false)
        },
        onError: (error) => {
          console.log("error", error)
          messagesStore.showError("checkoutScreen.errorOrder", true)
          commonStore.setVisibleLoading(false)
        },
      },
    )

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
      // RNUxcam.logEvent("checkout: errorSubmit", { errors })
      mixpanel.track("Checkout: Error form validation", { errors })
      __DEV__ && console.log({ errors })
      if (errors.fullAddress) {
        messagesStore.showError("addressScreen.addressCompleteRequired", true)
      }
    }

    const sendOrder = async (data) => {
      if (!addressStore.current.id) {
        await saveAddress(data.customerNote, data.fullAddress)
      }

      if (isPlan) {
        if (!getPaymentMethodId() && !userStore.paymentCash) {
          messagesStore.showError("checkoutScreen.errorSelectPaymentMethod", true)
          RNUxcam.logEvent("checkout: errorSelectPaymentMethod")
          mixpanel.track("Checkout: Error not payment method selected")
          return
        }
        commonStore.setVisibleLoading(true)
        const taxId = data.taxId?.trim().length === 0 ? "CF" : data.taxId.toUpperCase()
        const items = cartStore.cartPlans.map((item) => ({
          ...item,
          deliveryDate: item.date,
        }))

        const orderPlan: OrderPlanRequest = {
          userId: userStore.userId,
          totalCredits: plansStore.totalCredits,
          type: plansStore.type,
          amount: plansStore.price + priceDelivery(),
          expirationDate: plansStore.expireDate,
          items,
          timeZone: RNLocalize.getTimeZone(),
          addressId: userStore.addressId,
          noteDelivery: data.customerNote,
          taxId,
          paymentMethodType: getPaymentMethodId() ? "card" : "cash",
          paymentMethodTokenId: getPaymentMethodId(),
          versionApp: getVersion(),
          deviceType: Platform.OS,
          commentToChef: params?.commentToChef,
          currencyCode: userStore.account?.currency,
          deliveryPrice: priceDelivery(),
          isCustom: plansStore.isCustom,
          deliveryPricePerDay:
            plansStore.type === "test"
              ? 0
              : cartStore.calculateDeliveryPricePerDay(
                  plansStore.totalCredits,
                  plansStore.config.pricePerDay,
                  plansStore.config.minimumQuantityFreeDelivery,
                ),
        }
        createOrderPlan(orderPlan)
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

    const createOrderDish = async (data) => {
      Keyboard.dismiss()
      if (!dayStore.currentDay) {
        messagesStore.showError("checkoutScreen.errorDayDelivery" as TxKeyPath, true)
        RNUxcam.logEvent("checkout: errorDayDelivery")
        mixpanel.track("Checkout: Error not day delivery selected")
        return
      }

      if (labelDeliveryTime.length === 0 && !isPlan) {
        messagesStore.showError("checkoutScreen.errorTimeDelivery" as TxKeyPath, true)
        RNUxcam.logEvent("checkout: errorTimeDelivery")
        mixpanel.track("Checkout: Error no delivery time selected")
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
        paymentMethod: getPaymentMethodId() ? "card" : "cash", // Contra entrega o pago con tarjeta
        couponCode: coupon?.code,
        total: cartStore.calculateTotalForDishes(priceDelivery()),
        discount: cartStore.discount,
        couponType: coupon?.type,
      }

      orderStore
        .add(order)
        .then(async (res) => {
          commonStore.setVisibleLoading(false)
          __DEV__ && console.log("Code order response", res)

          if (!res) {
            messagesStore.showError("checkoutScreen.errorOrder", true)
            RNUxcam.logEvent("checkout: errorOrder")
            mixpanel.track("Checkout: Error on create order")

            return
          }

          if (Number(res.data) > 0) {
            await saveString("taxId", data.taxId)
            await saveString("customerNote", data.customerNote)
            await saveString("deliveryTime", labelDeliveryTime)

            __DEV__ && console.log("order added", res.data)

            // Track Result
            AppEventsLogger.logPurchase(
              cartStore.calculateTotalForDishes(priceDelivery()),
              getCurrency(),
              {
                description: "El usuario ha realizado un pedido",
              },
            )

            RNUxcam.logEvent("checkout: successOrder")

            mixpanel.track("Checkout: Order purchased", {
              customerId: order.customerId,
              total: order.total,
              priceDelivery: order.priceDelivery,
              couponCode: order.couponCode,
              productsLength: order.products.length,
              products: JSON.stringify(order.products),
              discount: cartStore.discount,
            })

            OneSignal.sendTag("purchased", "1")
            OneSignal.deleteTags(["dishId", "dishName", "dishPrice", "dishImage", "dishQuantity"])

            cartStore.setDiscount(0)

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
            mixpanel.track("Checkout: Error on payment order")
          } else {
            RNUxcam.logEvent("checkout: errorOrder")
            messagesStore.showError("checkoutScreen.errorOrder", true)
            mixpanel.track("Checkout: Error on process order")
          }
        })
        .catch((error: Error) => {
          RNUxcam.logEvent("checkout: ERROR CRITICAL")
          mixpanel.track("Checkout: Error on create order")
          messagesStore.showError(error.message)
        })
        .finally(() => commonStore.setVisibleLoading(false))

      __DEV__ && console.log(order)
    }

    const getProducts = (): Products[] => {
      return cartStore.cart.map((item) => ({
        productId: item.dish.id,
        quantity: item.quantity,
        price: item.dish.price,
        total: item.total,
        name: item.dish.title,
        noteChef: item.noteChef ?? "", // Nota que desea agregar el cliente para el chef
        metaData: item.metaData,
      }))
    }

    const getMetaData = (taxId: string): MetaData[] => {
      const data: MetaData[] = []

      // Add chef id
      data.push({
        key: "chef_id",
        value: `${commonStore.currentChefId}`,
      })

      // Add delivery time
      data.push({
        key: "delivery_time",
        value: `${labelDeliveryTime}`,
      })

      // Add delivery date
      data.push({
        key: "delivery_date",
        value: dayStore.currentDay.date,
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
      let text: string
      const total = cartStore.calculateTotalForDishes(priceDelivery())

      if (isPlan) {
        text = `${getI18nText("checkoutScreen.pay")} ${userStore.account?.currency} ${total}`
      } else {
        const paymentMethodText = getPaymentMethodId()
          ? "checkoutScreen.pay"
          : "checkoutScreen.makeOrder"

        text = `${getI18nText(paymentMethodText)} ${getFormat(total, getCurrency())}`
      }

      return text
    }

    const getCurrency = (): string => {
      return cartStore.cart[0]?.dish.chef.currencyCode
    }

    const getAddressText = (): string => {
      const address = ""
      if (addressStore.current.name && addressStore.current.name.trim().length > 0)
        address.concat(" - ")
      return address.concat(addressStore.current.address || addressStore.current.addressMap)
    }

    const onPressAddress = () => {
      modalStateLocation.setVisible(true)
      RNUxcam.logEvent("checkout: onPressAddress")
      mixpanel.track("Checkout: Press change address delivery")
    }

    const onPressCoupon = () => {
      modalStateCoupon.setVisible(true)
      RNUxcam.logEvent("checkout: onPressCoupon")
      mixpanel.track("Checkout: Press use coupon")
    }

    const priceDelivery = () => {
      if (cartStore.cart.length === 0) return 0

      if (coupon?.type === "deliveryFree") return 0

      return cartStore.cart[0]?.dish.chef.priceDelivery
    }

    const handleAddressData = (data) => {
      setCurrentAddressData(data)
    }

    const saveAddress = async (customerNote: string, fullAddress: string) => {
      const address = {
        ...addressStore.current,
        ...currentAddressData,
        address: fullAddress,
        instructionsDelivery: customerNote,
        userId: userStore.userId,
      }

      commonStore.setVisibleLoading(true)
      return await addressStore
        .add(address)
        .then((res) => {
          if (res) {
            address.id = res.data as number
            addressStore.setCurrent({ ...address })
            userStore.setAddressId(address.id)
            mixpanel.track("Add address from checkout")
            console.log("Saved address", res.data)
          }
        })
        .catch((error: Error) => {
          mixpanel.track("Add address error checkout")
          messagesStore.showError(error.message)
          commonStore.setVisibleLoading(false)
        })
    }

    const handleOpenModalAddress = () => {
      modalAddressFields.setVisible(true)
      mixpanel.track("Open modal address fields")
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
            {addressStore.current.id > 0 && (
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
            )}

            {!addressStore.current.id && (
              <View>
                <InputText
                  preset="card"
                  name="fullAddress"
                  placeholderTx="addressScreen.addressPlaceholder"
                  rules={{
                    required: "addressScreen.addressCompleteRequired",
                  }}
                  labelTx="addressScreen.addressComplete"
                  styleContainer={[utilSpacing.mb3]}
                  maxLength={400}
                  required
                ></InputText>

                <Button
                  size="sm"
                  text="Datos adicionales de dirección"
                  preset="gray"
                  style={[utilSpacing.mb6, utilSpacing.mx4]}
                  onPress={handleOpenModalAddress}
                ></Button>
              </View>
            )}

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

            <SelectPaymentMethod
              openPaymentList={() => modalStatePaymentList.setVisible(true)}
              isPlan={isPlan}
            ></SelectPaymentMethod>

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
            <Summary priceDelivery={priceDelivery()}></Summary>
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
        <ModalPaymentList stateModal={modalStatePaymentList} isPlan={isPlan}></ModalPaymentList>
        <ModalAddressFields
          onOkPress={handleAddressData}
          state={modalAddressFields}
        ></ModalAddressFields>
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
