import React from "react"
import { Button, Modal, Text, Image } from "../../components"
import { ModalState } from "../../utils/modalState"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { View, StyleSheet } from "react-native"
import images from "../../assets/images"

interface ModalNecessaryLocationProps {
  modalState: ModalState
}

const ModalNecessaryLocation = ({ modalState }: ModalNecessaryLocationProps) => {
  return (
    <Modal position="bottom" state={modalState}>
      <View>
        <Text
          preset="bold"
          size="lg"
          tx="modalNecessaryLocation.title"
          style={[utilSpacing.mb2, utilText.textCenter]}
        ></Text>
        <Image style={[styles.image, utilSpacing.mb5]} source={images.map}></Image>

        <Button
          onPress={() => modalState.setVisible(false)}
          tx="common.understand"
          style={[utilFlex.selfCenter, utilSpacing.mb4]}
        ></Button>
      </View>
    </Modal>
  )
}
export default ModalNecessaryLocation

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    height: 100,
    width: 100,
  },
})
