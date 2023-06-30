import React from "react"
import { StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import Ripple from "react-native-material-ripple"

import RNUxcam from "react-native-ux-cam"
import { Button, Modal, Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

const modalStateWhy = new ModalStateHandler()
export const ModalLeave = (props: { modalState: ModalStateHandler; onPressLeave: () => void }) => {
  const { modalState, onPressLeave } = props

  const onPressLeaveModal = () => {
    onPressLeave()
    AppEventsLogger.logEvent("PressCleanCart", 1, {
      description: "El usuario presionó 'Sí, salir' en el menú del chef",
    })

    RNUxcam.logEvent("acceptCleanCart")
  }

  const onPressCancel = () => {
    modalState.setVisible(false)
    AppEventsLogger.logEvent("CancelCleanCart", 1, {
      description: "El usuario presionó 'Regresar' en el menú del chef",
    })
    RNUxcam.logEvent("cancelCleanCart")
  }

  const onPressWhyCleanCart = () => {
    modalStateWhy.setVisible(true)
    AppEventsLogger.logEvent("PressWhyCleanCart", 1, {
      description: "El usuario presionó '¿Por qué?' en el menú del chef",
    })

    RNUxcam.logEvent("whyCleanCart")
  }

  return (
    <>
      <Modal state={modalState} style={styles.modal}>
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
            onPress={onPressLeaveModal}
            block
          ></Button>
          <Button
            block
            preset="white"
            style={utilFlex.selfCenter}
            tx="menuChefScreen.noLeave"
            onPress={onPressCancel}
          ></Button>

          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            style={styles.btnInfo}
            onPress={onPressWhyCleanCart}
          >
            <Text preset="bold" style={utilFlex.selfCenter} tx="menuChefScreen.why"></Text>
          </Ripple>
        </View>
      </Modal>
      <ModalWhy modalState={modalStateWhy}></ModalWhy>
    </>
  )
}

export const ModalWhy = (props: { modalState: ModalStateHandler }) => {
  const { modalState } = props
  return (
    <Modal state={modalState} style={styles.modal}>
      <View style={utilSpacing.p4}>
        <Text
          preset="bold"
          size="lg"
          style={[utilSpacing.mb5, utilSpacing.mt5, utilFlex.selfCenter]}
          tx="menuChefScreen.whyTitle"
        ></Text>
        <Text
          preset="semiBold"
          style={[utilSpacing.mb5, styles.textCenter]}
          tx="menuChefScreen.whyDescription"
        ></Text>
        <Button
          tx="common.understand"
          style={[utilSpacing.mb5, utilFlex.selfCenter]}
          onPress={() => modalState.setVisible(false)}
          block
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  btnInfo: {
    borderColor: color.palette.grayLight,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: spacing[4],
    padding: spacing[3],
  },
  modal: {
    alignSelf: "center",
    minWidth: 300,
    width: "80%",
  },
  textCenter: {
    textAlign: "center",
  },
})
