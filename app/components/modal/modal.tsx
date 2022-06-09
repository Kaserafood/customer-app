import { observer } from "mobx-react-lite"
import * as React from "react"
import { ImageURISource, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import ModalRN, { ModalProps } from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import images from "../../assets/images"
import { color, spacing } from "../../theme"
import { AutoImage } from "../auto-image/auto-image"

interface ModalState {
  isVisible: boolean
  setVisible: (state: boolean) => void
}

interface ModalProperties {
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

  /**
   * Position of the modal in the screen
   */
  position?: "center" | "top" | "bottom"

  /**
   * Indicates if the modal should hide on backdrop press
   */
  hideOnBackdropPress?: boolean

  /**
   * Visible icon close
   */
  isVisibleIconClose?: boolean
}

/**
 * Modal base for all modals.
 */
export const Modal = observer(function Modal(props: ModalProperties) {
  const {
    style,
    modal,
    children,
    styleContainer,
    styleBody,
    iconClose,
    position = "center",
    hideOnBackdropPress = true,
    isVisibleIconClose = true,
    ...rest
  } = props

  const getModalStyleByPosition = () => {
    switch (position) {
      case "center":
        return styles.center
      case "top":
        return styles.top
      case "bottom":
        return styles.bottom
    }
  }

  const getStyleBodyByPosition = () => {
    switch (position) {
      case "center":
        return styles.borderRadiusAll
      case "top":
        return styles.borderRadiusTop
      case "bottom":
        return styles.borderRadiusBottom
    }
  }

  const getAnimationInByPosition = () => {
    switch (position) {
      case "center":
        return "zoomIn"
      case "top":
        return "slideInUp"
      case "bottom":
        return "slideInDown"
    }
  }

  const getAnimationOutByPosition = () => {
    switch (position) {
      case "center":
        return "zoomOut"
      case "top":
        return "slideOutUp"
      case "bottom":
        return "slideOutDown"
    }
  }

  return (
    <ModalRN
      onBackdropPress={() => hideOnBackdropPress && modal.setVisible(false)}
      style={[getModalStyleByPosition(), style]}
      isVisible={modal.isVisible}
      animationIn={getAnimationInByPosition()}
      animationOut={getAnimationOutByPosition()}
      backdropColor={color.palette.grayTransparent}
      coverScreen={false}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
      {...rest}
    >
      <View style={[styles.content, styleContainer]}>
        <View style={[styles.body, getStyleBodyByPosition(), styleBody]}>
          {isVisibleIconClose && (
            <View style={styles.containerImgClose}>
              <TouchableOpacity onPress={() => modal.setVisible(false)} activeOpacity={0.7}>
                <AutoImage style={styles.imgClose} source={iconClose ?? images.close}></AutoImage>
              </TouchableOpacity>
            </View>
          )}

          {children}
        </View>
      </View>
    </ModalRN>
  )
})

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    backgroundColor: color.background,
    padding: spacing[3],
    position: "relative",
    width: "90%",
  },
  borderRadiusAll: {
    borderRadius: spacing[2],
  },
  borderRadiusBottom: {
    borderTopLeftRadius: spacing[2],
    borderTopRightRadius: spacing[2],
  },
  borderRadiusTop: {
    borderBottomLeftRadius: spacing[2],
    borderBottomRightRadius: spacing[2],
  },
  bottom: {
    justifyContent: "flex-end",
  },
  center: {
    alignSelf: "center",
    margin: "auto",
    maxWidth: "90%",
  },

  container: {
    margin: 0,
  },

  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },

  content: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  imgClose: {
    height: 20,
    width: 20,
  },

  top: {
    justifyContent: "flex-start",
  },
})
