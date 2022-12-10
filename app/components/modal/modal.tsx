import * as React from "react"
import { ImageURISource, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import ModalRN from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Icon } from "../icon/icon"
import { Image } from "../image/image"

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
  position?: "center" | "bottom"

  /**
   * Indicates if the modal should hide on backdrop press
   */
  hideOnBackdropPress?: boolean

  /**
   * Visible icon close
   */
  isVisibleIconClose?: boolean

  /**
   * Event when modal is hide
   */
  onHide?: () => void

  /**
   * Size with of the modal
   */
  size?: "md" | "lg"

  /**
   * Indicates if the modal should be full screen
   **/
  isFullScreen?: boolean
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
    onHide,
    size,
    isFullScreen,
    ...rest
  } = props

  const getModalStyleByPosition = () => {
    if (isFullScreen) return { ...styles.bottom, ...styles.fullScreen }

    switch (position) {
      case "center":
        return styles.center
      case "bottom":
        return styles.bottom
    }
  }

  const getStyleBodyByPosition = () => {
    if (isFullScreen) return { ...styles.bodyBottom, ...styles.noRadius }

    switch (position) {
      case "center":
        return styles.bodyCenter
      case "bottom":
        return styles.bodyBottom
    }
  }

  const getAnimationInByPosition = () => {
    if (isFullScreen) return "slideInUp"

    switch (position) {
      case "center":
        return "zoomIn"
      case "bottom":
        return "slideInUp"
    }
  }

  const getAnimationOutByPosition = () => {
    if (isFullScreen) return "slideOutDown"

    switch (position) {
      case "center":
        return "zoomOut"
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
      onModalHide={onHide}
      {...rest}
    >
      <View style={[styles.content, styleContainer]}>
        <View
          style={[
            styles.body,
            getStyleBodyByPosition(),
            size === "md" && styles.w80,
            styleBody,
            isFullScreen && styles.fullScreen,
          ]}
        >
          {(isVisibleIconClose && !isFullScreen) && (
            <>
              {
                position !== "bottom" ? (
                  <View style={styles.containerImgClose}>
                    <TouchableOpacity onPress={() => modal.setVisible(false)} activeOpacity={0.7}>
                      <Image style={styles.imgClose} source={iconClose ?? images.close}></Image>
                    </TouchableOpacity>
                  </View>

                ) : <View style={utilSpacing.py3}></View>
              }
            </>

          )}

          {
            isFullScreen && (
              <TouchableOpacity onPress={() => modal.setVisible(false)}>
                <Icon name="xmark" size={30} color={color.text}></Icon>
              </TouchableOpacity>
            )
          }

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
  },
  bodyBottom: {
    borderTopLeftRadius: spacing[3],
    borderTopRightRadius: spacing[3],
    width: "100%",
  },
  bodyCenter: {
    borderRadius: spacing[3],
    width: "90%",
  },

  bottom: {
    bottom: 0,
    justifyContent: "flex-end",
    margin: 0,
  },
  center: {
    margin: "auto",
  },

  container: {
    margin: 0,
  },

  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },

  content: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
  },
  fullScreen: {
    height: "100%",
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  noRadius: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  top: {
    justifyContent: "flex-start",
  },
  w80: {
    width: "80%",
  },
})
