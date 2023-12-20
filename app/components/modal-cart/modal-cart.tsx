import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import Ripple from "react-native-material-ripple"

import { useNavigation } from "@react-navigation/native"
import OneSignal from "react-native-onesignal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import RNUxcam from "react-native-ux-cam"
import images from "../../assets/images"
import { useStores } from "../../models"
import { MetaDataCart } from "../../models/cart-store"
import { Dish } from "../../models/dish"
import { DishChef } from "../../models/dish-store"
import { UserChef } from "../../models/user-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalState } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Image } from "../image/image"
import { Modal } from "../modal/modal"
import { Price } from "../price/price"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"

export interface ModalCartProps {
  /**
   * Mutable class for managing component visivility.
   */
  modal: ModalState

  /**
   * onContinue
   */
  onContinue: () => void

  /**
   * Current Chef
   */
  chef: UserChef
}

/**
 * Modal to show items in cart.
 */

const mixpanel = getInstanceMixpanel()
export const ModalCart = observer(function ModalCart(props: ModalCartProps) {
  const { modal, onContinue, chef } = props

  const { cartStore, dishStore } = useStores()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  useEffect(() => {
    if (modal.isVisible) {
      const items = [
        ...cartStore.cart.map((item) => {
          return {
            id: item.dish.id,
            name: item.dish.title,
            price: item.dish.price,
            quantity: item.quantity,
            chef: item.dish.chef.name,
            chefId: item.dish.chef.id,
          }
        }),
      ]

      RNUxcam.logEvent("openCart", {
        total: cartStore.subtotal,
        data: JSON.stringify(items),
      })

      mixpanel.track("View Modal Cart", {
        items,
      })
    }
  }, [modal.isVisible])

  const removeItemCart = (index: number, dish: Dish) => {
    cartStore.removeItem(index)

    if (cartStore.hasItems) {
      const { dish, quantity } = cartStore.cart[cartStore.cart.length - 1]

      OneSignal.sendTags({
        dishId: dish.id.toString(),
        dishName: dish.title,
        dishPrice: dish.price.toString(),
        dishImage: dish.image,
        dishQuantity: quantity.toString(),
      })
    } else {
      OneSignal.deleteTags(["dishId", "dishName", "dishPrice", "dishImage", "dishQuantity"])
    }

    RNUxcam.logEvent("removeDishInCart", {
      id: dish.id,
      name: dish.title,
      price: dish.price,
      currentTotal: cartStore.subtotal,
    })
    mixpanel.track("Remove dish in cart", {
      id: dish.id,
      name: dish.title,
      price: dish.price,
      currentTotal: cartStore.subtotal,
    })
    AppEventsLogger.logEvent("RemoveDishInCart", 1, {
      total: cartStore.subtotal,
      dishId: dish.id,
      dishName: dish.title,
      description: "El usuario elimino un producto del carrito",
    })
  }

  const toDishDetail = (
    dish: DishChef,
    addons: string,
    tempId: string,
    quantity: number,
    noteChef: string,
  ) => {
    RNUxcam.logEvent("cartPressItem", {
      id: dish.id,
      name: dish.title,
      price: dish.price,
      quantity,
      chef: dish.chef.name,
      chefId: dish.chef.id,
    })

    mixpanel.track("Press item in cart", {
      id: dish.id,
      name: dish.title,
      price: dish.price,
      quantity,
      chef: dish.chef.name,
      chefId: dish.chef.id,
    })
    dishStore.setIsUpdate(true)
    navigation.navigate(
      "dishDetail" as any,
      {
        ...dish,
        addons: JSON.parse(addons),
        isUpdate: true,
        tempId,
        quantity,
        noteChef,
        timestamp: new Date().getMilliseconds(),
      } as any,
    )
  }

  const continueToCheckout = () => {
    const items = [
      ...cartStore.cart.map((item) => {
        return {
          id: item.dish.id,
          name: item.dish.title,
          price: item.dish.price,
          quantity: item.quantity,
          chef: item.dish.chef.name,
          chefId: item.dish.chef.id,
        }
      }),
    ]
    RNUxcam.logEvent("cartContinueToCheckout", {
      total: cartStore.subtotal,
      data: JSON.stringify(items),
    })
    mixpanel.track("From Cart To Checkout", { items })
    onContinue()
  }
  return (
    <Modal state={modal} position="bottom">
      <View style={styles.body}>
        <View style={[utilFlex.flexRow, utilSpacing.mb4, utilSpacing.ml4]}>
          <Image source={{ uri: chef.image }} style={styles.imageChef}></Image>
          <Text preset="bold" style={utilFlex.flex1} text={chef.name}></Text>
        </View>

        <ScrollView style={styles.containerDishes}>
          {cartStore.cart.map((item, index) => (
            <Card key={item.tempId} style={[utilFlex.flexRow, utilSpacing.m4, utilSpacing.p0]}>
              <TouchableOpacity
                style={[utilFlex.flexRow, styles.card, utilSpacing.p5, utilFlex.flex1]}
                onPress={() =>
                  toDishDetail(item.dish, item.addons, item.tempId, item.quantity, item.noteChef)
                }
              >
                <View style={[utilFlex.flexRow, utilFlex.flex1]}>
                  <View style={utilSpacing.mr3}>
                    <Text preset="semiBold" text={`X ${item.quantity.toString()}`}></Text>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text preset="semiBold" numberOfLines={2} text={item.dish.title}></Text>
                    {item.metaData.length > 0 && <CartItemAddon metaDataCart={item.metaData} />}

                    {item.noteChef?.length > 0 && (
                      <Text
                        numberOfLines={2}
                        style={[utilSpacing.ml2, utilSpacing.mt4]}
                        caption
                        preset="semiBold"
                        size="sm"
                        text={`${getI18nText("menuChefScreen.commentChef")} ${item.noteChef}`}
                      />
                    )}
                  </View>
                </View>

                <View>
                  <Price
                    style={styles.price}
                    textStyle={utilText.bold}
                    amount={item.total}
                    currencyCode={chef.currencyCode}
                  ></Price>
                </View>
              </TouchableOpacity>

              <Ripple
                rippleContainerBorderRadius={100}
                rippleOpacity={0.07}
                rippleDuration={400}
                style={[utilSpacing.p2, styles.containerIconRemove]}
                onPress={() => removeItemCart(index, item.dish)}
              >
                <Image style={styles.iconRemove} source={images.close}></Image>
              </Ripple>
            </Card>
          ))}
        </ScrollView>
        <View style={utilSpacing.mx4}>
          <Separator style={utilSpacing.my4}></Separator>
        </View>
        <View style={[utilFlex.flexRow, utilSpacing.mx6]}>
          <Text preset="bold" style={utilFlex.flex1} tx="common.subtotal"></Text>
          <Price
            style={styles.price}
            amount={cartStore.subtotal}
            currencyCode={chef.currencyCode}
          ></Price>
        </View>
        <Button
          disabled={!cartStore.hasItems}
          onPress={continueToCheckout}
          style={[utilSpacing.mt6, styles.button]}
          block
          tx="common.continue"
        ></Button>
        <View style={{ height: insets.bottom, backgroundColor: color.background }}></View>
      </View>
    </Modal>
  )
})

export const CartItemAddon = (props: { metaDataCart: MetaDataCart[] }) => {
  const { metaDataCart } = props

  return (
    <View style={utilSpacing.mt2}>
      {metaDataCart.map((item, index) => (
        <View key={item.key ?? index} style={utilFlex.flexRow}>
          <View>
            <Text
              numberOfLines={2}
              style={utilSpacing.ml2}
              caption
              preset="semiBold"
              size="sm"
              text={`${item.value}`}
            ></Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    bottom: 0,
    position: "relative",
    width: "97%",
  },
  button: {
    alignSelf: "center",
    display: "flex",
    width: "80%",
  },
  card: {
    backgroundColor: color.background,
    borderRadius: spacing[2],
  },
  containerDishes: {
    maxHeight: 320,
  },
  containerIconRemove: {
    height: 45,
    paddingBottom: 16,
    paddingLeft: 16,
    position: "absolute",
    right: 4,
    top: 4,
    width: 45,
  },
  iconRemove: {
    alignSelf: "flex-end",
    height: 10,
    width: 10,
  },
  imageChef: {
    borderRadius: spacing[2],
    height: 50,
    marginRight: spacing[3],
    width: 50,
  },
  price: {
    backgroundColor: color.background,
    paddingRight: 0,
  },
})
