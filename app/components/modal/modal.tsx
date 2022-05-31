import { observer } from "mobx-react-lite"
import * as React from "react"
import { ImageURISource, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import ModalRN from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import images from "../../assets/images"
import { color, spacing } from "../../theme"
import { AutoImage } from "../auto-image/auto-image"

interface ModalState {
  isVisible: boolean
  setVisible: (state: boolean) => void
}

export interface ModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override container styles
   */
  styleContainer?: StyleProp<ViewStyle>

  /**
   * An optional style override body styles
   */
  styleBody?: StyleProp<ViewStyle>

  /**
   * Mutable class for managing component visivility.
   */
  modal: ModalState

  /**
   * Body of the modal
   */
  children: React.ReactNode

  /**
   * An optional icon close to be displayed on the right top side of the modal
   */

  iconClose?: ImageURISource
}

/**
 * Modal base for all modals.
 */
export const Modal = observer(function Modal(props: ModalProps) {
  const { style, modal, children, styleContainer, styleBody, iconClose } = props
  return (
    <ModalRN
      onBackdropPress={() => modal.setVisible(false)}
      style={[styles.container, style]}
      isVisible={modal.isVisible}
      backdropColor={color.palette.grayTransparent}
      coverScreen={false}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
    >
      <View style={[styles.content, styleContainer]}>
        <View style={styles.containerImgClose}>
          <TouchableOpacity onPress={() => modal.setVisible(false)} activeOpacity={0.7}>
            <AutoImage style={styles.imgClose} source={iconClose ?? images.close}></AutoImage>
          </TouchableOpacity>
        </View>
        <View style={[styles.body, styleBody]}>{children}</View>
      </View>
    </ModalRN>
  )
})

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    bottom: 0,
    position: "relative",
    width: "90%",
  },

  container: {
    justifyContent: "flex-end",
    margin: 0,
  },

  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  content: {
    backgroundColor: color.background,
    borderTopEndRadius: spacing[2],
    borderTopStartRadius: spacing[2],
    display: "flex",
    justifyContent: "flex-start",
    padding: spacing[3],
  },

  imgClose: {
    height: 20,
    width: 20,
  },
})
