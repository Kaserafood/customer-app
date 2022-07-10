import { observer } from "mobx-react-lite"
import * as React from "react"
import { ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import images from "../../assets/images"
import { useStores } from "../../models"
import { MetaDataCart } from "../../models/cart-store"
import { UserChef } from "../../models/user-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Price } from "../price/price"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"

interface ModalState {
  isVisible: boolean
  setVisible: (state: boolean) => void
}

export interface ModalCartProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

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
 * Describe your component here
 */
export const ModalCart = observer(function ModalCart(props: ModalCartProps) {
  const { style, modal, onContinue, chef } = props

  const { cartStore } = useStores()

  return (
    <Modal
      onBackdropPress={() => modal.setVisible(false)}
      style={[styles.container, style]}
      isVisible={modal.isVisible}
      backdropColor={color.palette.grayTransparent}
      coverScreen={false}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
    >
      <View style={styles.content}>
        <View style={styles.containerImgClose}>
          <TouchableOpacity onPress={() => modal.setVisible(false)} activeOpacity={0.7}>
            <AutoImage style={styles.imgClose} source={images.close}></AutoImage>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={[utilFlex.flexRow, utilSpacing.mb4, utilSpacing.ml4]}>
            <AutoImage source={{ uri: chef.image }} style={styles.imageChef}></AutoImage>
            <Text preset="bold" style={utilFlex.flex1} text={chef.name}></Text>
          </View>

          <ScrollView style={styles.containerDishes}>
            {cartStore.cart.map((item, index) => (
              <Card key={item.dish.id} style={[styles.card, utilFlex.flexRow, utilSpacing.m4]}>
                <View style={[utilFlex.flexRow, utilFlex.flex1]}>
                  <View style={utilSpacing.mr3}>
                    <Text preset="semiBold" text={`X ${item.quantity.toString()}`}></Text>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text preset="semiBold" numberOfLines={2} text={item.dish.title}></Text>
                    {item.metaData.length > 0 && (
                      <CartItemAddon metaDataCart={item.metaData}></CartItemAddon>
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
                  rippleOpacity={0.1}
                  rippleDuration={400}
                  style={[utilSpacing.p2, styles.containerIconRemove]}
                  onPress={() => cartStore.removeItem(index)}
                >
                  <AutoImage style={[styles.iconRemove]} source={images.close}></AutoImage>
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
      </View>
    </Modal>
  )
})

export const CartItemAddon = (props: { metaDataCart: MetaDataCart[] }) => {
  const { metaDataCart } = props
  console.log(JSON.stringify(metaDataCart))
  return (
    <View style={[utilSpacing.mt2, { backgroundColor: "red" }]}>
      {metaDataCart.map((item) => (
        <View key={item.key} style={utilFlex.flexRow}>
          {Number(item.value) > 0 && <Text caption size="sm" text={item.value}></Text>}
          <Text
            numberOfLines={1}
            style={utilSpacing.ml2}
            caption
            size="sm"
            text={`${item.label}`}
          ></Text>
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
  container: {
    justifyContent: "flex-end",
    margin: 0,
  },
  containerDishes: {
    maxHeight: 320,
  },
  containerIconRemove: {
    paddingBottom: 16,
    paddingLeft: 16,
    position: "absolute",
    right: 4,
    top: 4,
  },
  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  content: {
    backgroundColor: color.background,

    borderTopEndRadius: spacing[2],
    borderTopStartRadius: spacing[2],
    display: "flex",
    justifyContent: "flex-start",
    padding: spacing[3],
  },
  iconRemove: {
    height: 10,
    width: 10,
  },
  imageChef: {
    borderRadius: spacing[2],
    height: 50,
    marginRight: spacing[3],
    width: 50,
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  price: {
    backgroundColor: color.background,
    paddingRight: 0,
  },
})
