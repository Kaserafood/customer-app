import React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import images from "../../assets/images"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Button } from "../button/button"
import { Image } from "../image/image"
import { Text } from "../text/text"

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
   * Modal state to handle visibility
   */
  modal?: ModalState
}

/**
 * Modal to explain why the user need to select a delivery date
 */
export const DayDeliveryModal = function DayDelivery(props: DayDeliveryProps) {
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
              <Image style={styles.imgClose} source={images.close}></Image>
            </TouchableOpacity>
          </View>
          <View style={utilSpacing.p4}>
            <Text
              preset="bold"
              size="lg"
              tx="modalDeliveryDay.title"
              style={utilSpacing.mb5}
            ></Text>
            <Text tx="modalDeliveryDay.description"></Text>
            <View style={[styles.containerImgModalWhy, utilSpacing.my5]}>
              <Image style={styles.imgModalWhy} source={images.step2}></Image>
            </View>

            <Button
              tx="common.continue"
              block
              style={utilSpacing.mb5}
              onPress={() => modal.setVisibleWhy(false)}
            ></Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bodyModal: {
    backgroundColor: color.background,
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
