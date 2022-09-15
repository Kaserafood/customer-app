import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button } from "../../components/button/button"
import { Image } from "../../components/image/image"
import { Modal } from "../../components/modal/modal"
import { Text } from "../../components/text/text"
import { goBack } from "../../navigators/navigation-utilities"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"

export const ModalReportBug = (props: { modalState: ModalState }) => {
  const { modalState } = props

  return (
    <Modal modal={modalState} size="md" onHide={() => goBack()}>
      <View style={utilSpacing.px3}>
        <Image source={images.bug} style={[styles.bug, utilFlex.selfCenter]}></Image>
        <Text
          preset="bold"
          size="lg"
          style={[utilFlex.selfCenter, utilSpacing.p4]}
          tx="modalReportBug.title"
        ></Text>
        <Text tx="modalReportBug.info" style={utilSpacing.pb5}></Text>
        <Button
          tx="common.ok"
          style={[utilFlex.selfCenter, utilSpacing.mt5]}
          onPress={() => modalState.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  bug: {
    width: 130,
  },
})
