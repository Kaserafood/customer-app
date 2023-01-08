import * as React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import Ripple from "react-native-material-ripple"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { useStores } from "../../models"
import { MetaDataCart } from "../../models/cart-store"
import { Dish } from "../../models/dish"
import { UserChef } from "../../models/user-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Image } from "../image/image"
import { Modal } from "../modal/modal"
import { Price } from "../price/price"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"
import { getFormat } from "../../utils/price"

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
export const ModalCart = observer(function ModalCart(props: ModalCartProps) {
  const { modal, onContinue, chef } = props

  const { cartStore } = useStores()

  const removeItemCart = (index: number, dish: Dish) => {
    cartStore.removeItem(index)
    AppEventsLogger.logEvent("RemoveDishInCart", 1, {
      total: cartStore.subtotal,
      dishId: dish.id,
      dishName: dish.title,
      description: "El usuario elimino un producto del carrito",
    })
  }

  return (
    <Modal modal={modal} position="bottom">
      <View style={styles.body}>
        <View style={[utilFlex.flexRow, utilSpacing.mb4, utilSpacing.ml4]}>
          <Image source={{ uri: chef.image }} style={styles.imageChef}></Image>
          <Text preset="bold" style={utilFlex.flex1} text={chef.name}></Text>
        </View>

        <ScrollView style={styles.containerDishes}>
          {cartStore.cart.map((item, index) => (
            <Card key={item.tempId} style={[styles.card, utilFlex.flexRow, utilSpacing.m4]}>
              <View style={[utilFlex.flexRow, utilFlex.flex1]}>
                <View style={utilSpacing.mr3}>
                  <Text preset="semiBold" text={`X ${item.quantity.toString()}`}></Text>
                </View>
                <View style={utilFlex.flex1}>
                  <Text preset="semiBold" numberOfLines={2} text={item.dish.title}></Text>
                  {item.metaData.length > 0 && (
                    <CartItemAddon
                      metaDataCart={item.metaData}
                    ></CartItemAddon>
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
          onPress={onContinue}
          style={[utilSpacing.mt6, styles.button]}
          block
          tx="common.continue"
        ></Button>
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
    alignItems: "center",
    backgroundColor: color.background,
    borderRadius: spacing[2],
    padding: spacing[4],
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
  containerMetaText: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 1,
    flexWrap: "wrap",
  },
})
