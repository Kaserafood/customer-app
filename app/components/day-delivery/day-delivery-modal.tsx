import images from "assets/images"
import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button, Text } from ".."
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"

interface ModalState {
  isVisibleWhy: boolean
  setVisibleWhy: (state: boolean) => void
}

export interface DayDeliveryProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Modal
   */
  modal?: ModalState
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDeliveryModal = observer(function DayDelivery(props: DayDeliveryProps) {
  const { style, modal } = props

  return (
    <Modal
      isVisible={modal?.isVisibleWhy || false}
      backdropColor={color.palette.grayTransparent}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={style}
      coverScreen={false}
      onBackdropPress={() => modal.setVisibleWhy(false)}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
    >
      <View style={styles.containerModal}>
        <View style={styles.bodyModal}>
          <View style={styles.containerImgClose}>
            <TouchableOpacity onPress={() => modal.setVisibleWhy(false)} activeOpacity={0.7}>
              <AutoImage style={styles.imgClose} source={images.close}></AutoImage>
            </TouchableOpacity>
          </View>
          <View style={utilSpacing.p4}>
            <Text preset="bold" tx="modalDeliveryDay.title" style={utilSpacing.mb5}></Text>
            <Text tx="modalDeliveryDay.description"></Text>
            <View style={[styles.containerImgModalWhy, utilSpacing.my5]}>
              <AutoImage style={styles.imgModalWhy} source={images.step2}></AutoImage>
            </View>

            <Button
              tx="modalDeliveryDay.continue"
              block
              rounded
              style={utilSpacing.mb5}
              onPress={() => modal.setVisibleWhy(false)}
            ></Button>
          </View>
        </View>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  bodyModal: {
    backgroundColor: color.palette.white,
    borderRadius: 20,
    padding: spacing[3],
    width: "90%",
  },
  chip: {
    marginBottom: spacing[2],
    marginRight: spacing[2],
  },
  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  containerImgModalWhy: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  containerModal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },

  flex: {
    display: "flex",
    flexDirection: "row",
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  imgModalWhy: {
    height: 150,
    width: 150,
  },

  why: {
    alignItems: "center",
  },
})
