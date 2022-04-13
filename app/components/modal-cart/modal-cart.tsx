import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import Modal from "react-native-modal"
import { useStores } from "../../models"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { AutoImage } from "../auto-image/auto-image"
import images from "assets/images"
import { utilFlex, utilText, utilSpacing, SHADOW } from "../../theme/Util"
import { Price } from "../price/price"
import { Separator } from "../separator/separator"
import { Button } from "../button/button"

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
}

/**
 * Describe your component here
 */
export const ModalCart = observer(function ModalCart(props: ModalCartProps) {
  const { style, modal, onContinue } = props

  const showModal = (state) => {
    modal.setVisible(state)
  }

  return (
    <Modal
      swipeDirection={["up", "left", "right", "down"]}
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
        <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
          <AutoImage source={images.chef1} style={styles.imageChef}></AutoImage>
          <Text preset="bold" style={utilFlex.flex1} text="eChef junita"></Text>
        </View>
        <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb3]}>
          <View style={utilSpacing.mr3}>
            <Text preset="semiBold" size="sm" text="x1"></Text>
          </View>
          <View style={utilFlex.flex1}>
            <Text preset="semiBold" text="Enchiladas verdes"></Text>
            <Text size="sm" text="Horchta as fasd s" style={utilText.textGray}></Text>
          </View>
          <View>
            <Price style={styles.price} textStyle={utilText.bold} amount={40}></Price>
          </View>
          {/* AGREGAR ICONO DE QUITAR, ACTUALMENTE ESTA PEQUEÑO, VERFIICAR QUE SE PUEDE HACER */}
        </View>
        <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb3]}>
          <View style={utilSpacing.mr3}>
            <Text preset="semiBold" size="sm" text="x1"></Text>
          </View>
          <View style={utilFlex.flex1}>
            <Text preset="semiBold" text="Enchiladas verdes"></Text>
            <Text size="sm" text="Horchta as fasd s" style={utilText.textGray}></Text>
          </View>
          <View>
            <Price style={styles.price} textStyle={utilText.bold} amount={40}></Price>
          </View>
          {/* AGREGAR ICONO DE QUITAR, ACTUALMENTE ESTA PEQUEÑO, VERFIICAR QUE SE PUEDE HACER */}
        </View>
        <Separator style={utilSpacing.my4}></Separator>
        <View style={utilFlex.flexRow}>
          <Text preset="bold" style={utilFlex.flex1} tx="common.subtotal"></Text>
          <Price style={styles.price} amount={20}></Price>
        </View>
        <Button
          onPress={onContinue}
          style={[utilSpacing.mt6, styles.button]}
          block
          rounded
          tx="common.continue"
        ></Button>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    display: "flex",
    width: "75%",
  },
  card: {
    backgroundColor: color.background,
    borderRadius: spacing[2],
    padding: spacing[3],
    ...SHADOW,
  },
  container: {
    justifyContent: "flex-end",
    margin: 0,
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
    padding: spacing[3],
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
  },
})
