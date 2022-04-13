import React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button } from "../button/button"
import { AutoImage } from "../auto-image/auto-image"
import Images from "assets/images"
import { Text } from "../text/text"
import { useStores } from "../../models"

export interface DayDeliveryProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDeliveryModal = observer(function DayDelivery(props: DayDeliveryProps) {
  const { style } = props
  const { modalStore } = useStores()

  return (
    <Modal
      isVisible={modalStore.isVisibleModalDayDelivery}
      backdropColor={color.palette.grayTransparent}
      backdropOpacity={1}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={style}
      coverScreen={false}
      onModalShow={() => changeNavigationBarColor(color.palette.whiteGray, true, true)}
    >
      <View style={styles.containerModal}>
        <View style={styles.bodyModal}>
          <View style={styles.containerImgClose}>
            <TouchableOpacity
              onPress={() => modalStore.setVisibleModalDayDelivery(false)}
              activeOpacity={0.7}
            >
              <AutoImage style={styles.imgClose} source={Images.close}></AutoImage>
            </TouchableOpacity>
          </View>
          <View style={utilSpacing.p4}>
            <Text preset="bold" tx="modalDeliveryDay.title" style={utilSpacing.mb5}></Text>
            <Text size="sm" tx="modalDeliveryDay.description"></Text>
            <View style={[styles.containerImgModalWhy, utilSpacing.my5]}>
              <AutoImage style={styles.imgModalWhy} source={Images.step2}></AutoImage>
            </View>

            <Button
              tx="modalDeliveryDay.continue"
              block
              rounded
              style={utilSpacing.mb5}
              onPress={() => modalStore.setVisibleModalDayDelivery(false)}
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
