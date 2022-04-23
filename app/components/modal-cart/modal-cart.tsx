import images from "assets/images"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { ScrollView, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { AutoImage, Button, Price, Separator, Text } from ".."
import { useStores } from "../../models"
import { UserChef } from "../../models/user-store/user-store"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"

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
      style={[style, styles.container]}
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
          <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
            <AutoImage source={{ uri: chef.image }} style={styles.imageChef}></AutoImage>
            <Text preset="bold" style={utilFlex.flex1} text={chef.name}></Text>
          </View>

          <ScrollView style={styles.containerDishes}>
            {cartStore.cart.map((item, index) => (
              <View key={item.dish.id} style={[styles.card, utilFlex.flexRow, utilSpacing.mb4]}>
                <View style={[utilFlex.flexRow, utilFlex.flex1]}>
                  <View style={utilSpacing.mr3}>
                    <Text preset="semiBold" text={`X ${item.quantity.toString()}`}></Text>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text preset="semiBold" numberOfLines={1} text={item.dish.title}></Text>
                    <Text
                      size="sm"
                      numberOfLines={1}
                      text={item.dish.description}
                      style={utilText.textGray}
                    ></Text>
                  </View>
                </View>

                <View>
                  <Price style={styles.price} textStyle={utilText.bold} amount={item.total}></Price>
                </View>
                <Ripple
                  style={[utilSpacing.p2, styles.containerIconRemove]}
                  onPress={() => cartStore.removeItem(index)}
                >
                  <AutoImage style={styles.iconRemove} source={images.close}></AutoImage>
                </Ripple>
              </View>
            ))}
          </ScrollView>

          <Separator style={utilSpacing.my4}></Separator>
          <View style={[utilFlex.flexRow, utilSpacing.mx6]}>
            <Text preset="bold" style={utilFlex.flex1} tx="common.subtotal"></Text>
            <Price style={styles.price} amount={cartStore.subtotal}></Price>
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

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",

    bottom: 0,
    position: "relative",
    width: "85%",
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
    ...SHADOW,
  },
  container: {
    justifyContent: "flex-end",
    margin: 0,
  },
  containerDishes: {
    maxHeight: 320,
  },
  containerIconRemove: {
    borderRadius: 100,
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
    height: 18,
    width: 18,
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
