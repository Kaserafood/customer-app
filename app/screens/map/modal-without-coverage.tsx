import React from "react"
import { View } from "react-native"
import { Button, Modal, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

export const ModalWithoutCoverage = (props: { modalState: ModalStateHandler }) => {
  const { modalState } = props
  return (
    <Modal modal={modalState}>
      <View style={utilSpacing.p3}>
        <Text
          preset="bold"
          size="lg"
          style={utilSpacing.pb5}
          tx="modalWithoutCoverage.title"
        ></Text>
        <Text tx="modalWithoutCoverage.info" style={utilSpacing.pb5}></Text>
        <Button
          tx="common.ok"
          onPress={() => modalState.setVisible(false)}
          style={utilFlex.selfCenter}
        ></Button>
      </View>
    </Modal>
  )
}
