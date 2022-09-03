import React from "react"
import { View } from "react-native"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"
import { Button } from "../button/button"
import { Icon } from "../icon/icon"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"
export const ModalNecessaryLocation = (props: { modalState: ModalState }) => {
  return (
    <Modal modal={props.modalState}>
      <View style={utilSpacing.px3}>
        <Icon
          name="location-dot"
          size={60}
          color={color.text}
          style={[utilFlex.selfCenter, utilSpacing.pb4]}
        ></Icon>
        <Text
          tx="modalNecessaryLocation.title"
          preset="bold"
          size="lg"
          style={utilSpacing.pb3}
        ></Text>
        <Text tx="modalNecessaryLocation.description" style={utilSpacing.pb3}></Text>
        <Button
          tx="common.ok"
          style={[utilSpacing.mx4, utilFlex.selfCenter, utilSpacing.my4]}
          onPress={() => props.modalState.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}
