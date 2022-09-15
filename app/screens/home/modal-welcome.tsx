import React from "react"
import { View } from "react-native"
import { Button, Modal, Text } from "../../components"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

interface PropsModalWelcome {
  modalState: ModalStateHandler
}
export const ModalWelcome = (props: PropsModalWelcome) => {
  return (
    <Modal modal={props.modalState}>
      <View style={utilSpacing.px6}>
        <Text tx="banner.whatIsKasera" preset="bold" size="lg" style={utilSpacing.mb5}></Text>
        <Text tx="banner.whatIsKaseraDescription1" style={utilSpacing.mb4}></Text>
        <Text tx="banner.whatIsKaseraDescription2" style={utilSpacing.mb4}></Text>
        <Text tx="banner.whatIsKaseraDescription3" style={utilSpacing.mb4}></Text>
        <Text tx="banner.whatIsKaseraDescription4" style={utilSpacing.mb4}></Text>
        <Button
          onPress={() => props.modalState.setVisible(false)}
          tx="common.next"
          style={utilSpacing.my4}
          block
        ></Button>
      </View>
    </Modal>
  )
}
