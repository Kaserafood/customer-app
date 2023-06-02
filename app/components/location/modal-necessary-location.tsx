import React from "react"
import { View, StyleSheet } from "react-native"

import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"
import { Button } from "../button/button"
import { Image } from "../image/image"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"
import images from "../../assets/images"

export const ModalNecessaryLocation = (props: { modalState: ModalState }) => {
  return (
    <Modal modal={props.modalState} size="md">
      <View style={utilSpacing.px3}>
        <Image style={[styles.image, utilSpacing.mb5]} source={images.map}></Image>

        <Text
          tx="modalNecessaryLocation.title"
          preset="bold"
          size="lg"
          style={[utilSpacing.pb3, utilText.textCenter]}
        ></Text>
        <Button
          tx="common.understand"
          style={[utilSpacing.mx4, utilFlex.selfCenter, utilSpacing.my4]}
          onPress={() => props.modalState.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    height: 100,
    width: 100,
  },
})
