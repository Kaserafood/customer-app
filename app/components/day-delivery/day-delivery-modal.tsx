import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"

import images from "../../assets/images"
import { spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"
import { Button } from "../button/button"
import { Image } from "../image/image"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"

export interface DayDeliveryProps {
  /**
   * Modal state to handle visibility
   */
  modal?: ModalState
}

/**
 * Modal to explain why the user need to select a delivery date
 */
export const DayDeliveryModal = observer(function DayDelivery(props: DayDeliveryProps) {
  const { modal } = props
  return (
    <Modal state={modal} style={styles.modal}>
      <View style={utilSpacing.p4}>
        <Text preset="bold" size="lg" tx="modalDeliveryDay.title" style={utilSpacing.mb5}></Text>
        <Text tx="modalDeliveryDay.description"></Text>
        <View style={[styles.containerImgModalWhy, utilSpacing.my5]}>
          <Image style={styles.imgModalWhy} source={images.step2}></Image>
        </View>

        <Button
          tx="common.understand"
          block
          style={utilSpacing.mb5}
          onPress={() => modal.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
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
  modal: {
    alignSelf: "center",
    minWidth: 300,
    width: "88%",
  },

  why: {
    alignItems: "center",
  },
})
