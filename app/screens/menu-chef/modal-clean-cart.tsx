import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Modal, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

export const ModalLeave = (props: { modalState: ModalStateHandler; onPressLeave: () => void }) => {
  const { modalState, onPressLeave } = props
  return (
    <Modal modal={modalState} style={styles.modal}>
      <View style={utilSpacing.p4}>
        <Text
          preset="bold"
          size="lg"
          style={[utilSpacing.mb5, utilSpacing.mt5, utilFlex.selfCenter]}
          tx="menuChefScreen.leave"
        ></Text>
        <Text
          preset="semiBold"
          style={[utilSpacing.mb5, styles.textCenter]}
          tx="menuChefScreen.leaveDescription"
        ></Text>
        <Button
          tx="menuChefScreen.yesLeave"
          style={[utilSpacing.mb5, utilFlex.selfCenter]}
          onPress={() => onPressLeave()}
          block
        ></Button>
        <Button
          block
          preset="white"
          style={[utilSpacing.mb3, utilFlex.selfCenter]}
          tx="menuChefScreen.noLeave"
          onPress={() => modalState.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    width: "80%",
    minWidth: 300,
    alignSelf: "center",
  },
  textCenter: {
    textAlign: "center",
  },
})
