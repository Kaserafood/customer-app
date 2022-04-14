import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import LottieView from "lottie-react-native"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

const CONTAINER: ViewStyle = {
  flex: 1,
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 100,
  justifyContent: "center",

  backgroundColor: "rgba(255,255,255,0.2)",
}

const SPINNER: ViewStyle = {
  height: 100,
  width: 100,
  display: "flex",
  alignSelf: "center",
  zIndex: 10000,
}
export interface LoaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Is visible spinner
   */
  visible?: boolean
}

/**
 * Describe your component here
 */
export const Loader = observer(function Loader(props: LoaderProps) {
  const { style, visible } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <>
      {visible && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles}>
          <LottieView style={SPINNER} source={require("./spinner.json")} autoPlay loop />
        </Animated.View>
      )}
    </>
  )
})
