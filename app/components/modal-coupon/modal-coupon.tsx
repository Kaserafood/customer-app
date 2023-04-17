import * as React from "react"
import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"

import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { Button } from "../button/button"
import { Image } from "../image/image"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"
import RNUxcam from "react-native-ux-cam"

const modalStateCoupon = new ModalStateHandler()
/**
 * Modal to show when user press the push notification an id type of coupon.
 */
export const ModalCoupon = observer(function ModalCoupon() {
  const { couponModalStore } = useStores()

  useEffect(() => {
    couponModalStore.resetValue()
  }, [])

  useEffect(() => {
    modalStateCoupon.setVisible(couponModalStore.isVisible)
  }, [couponModalStore.isVisible])

  const onUnderstand = () => {
    couponModalStore.setVisible(false)
    RNUxcam.logEvent("understandCoupon")
  }

  return (
    <Modal
      modal={modalStateCoupon}
      isVisibleIconClose={false}
      position="bottom"
      onHide={() => couponModalStore.setVisible(false)}
    >
      <View style={utilSpacing.py5}>
        <Text
          style={[utilSpacing.px4, utilSpacing.mb4, utilFlex.selfCenter, styles.text]}
          text={couponModalStore.title}
          preset="bold"
          size="xl"
        ></Text>
        <Text
          style={[utilSpacing.px4, utilSpacing.mb4, utilFlex.selfCenter, styles.text]}
          text={couponModalStore.subtitle}
          caption
        ></Text>
        {couponModalStore.image?.length > 0 && (
          <Image
            style={[styles.image, utilFlex.selfCenter, utilSpacing.mb4]}
            source={{ uri: couponModalStore.image }}
          ></Image>
        )}

        <Button tx="common.understand" onPress={onUnderstand} style={utilFlex.selfCenter}></Button>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
  },
  text: {
    textAlign: "center",
  },
})
