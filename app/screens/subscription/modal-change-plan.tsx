import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Image, Modal, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"

interface ModalProps {
  state: ModalState
}

const ModalChangePlan = ({ state }: ModalProps) => {
  return (
    <Modal state={state} size="md">
      <View>
        <Image source={images.change} style={[styles.img, utilFlex.selfCenter]}></Image>
        <Text
          tx="subscriptionScreen.changePlan"
          preset="bold"
          size="lg"
          style={[utilFlex.selfCenter, utilSpacing.pt6]}
        ></Text>
        <Text
          tx="subscriptionScreen.changePlanDescription"
          style={[utilSpacing.m4, utilFlex.selfCenter]}
        ></Text>

        <Button
          tx="common.understand"
          style={[utilSpacing.my5, utilSpacing.px5, utilFlex.selfCenter]}
          onPress={() => state.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  img: {
    height: 100,
    width: 100,
  },
})

export default ModalChangePlan
