import LottieView from "lottie-react-native"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import Animated, { color, FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated"
import { useStores } from "../../models/root-store/root-store-context"
import { color as colorTheme, spacing } from "../../theme"
const CONTAINER: ViewStyle = {
  flex: 1,
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 10000,
  justifyContent: "center",
  backgroundColor: colorTheme.palette.grayLoader,
}

const SPINNER: ViewStyle = {
  height: 200,
  width: 200,
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
 * Show a spinner overvlay while make http request or process async
 */
export const Loader = observer(function Loader(props: LoaderProps) {
  const { style, visible } = props
  const styles = Object.assign({}, CONTAINER, style)
  const { commonStore } = useStores()

  return (
    <>
      {(visible || commonStore.isVisibleLoading) && (
        <View style={styles}>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Animated.View entering={ZoomIn} exiting={ZoomOut}>
              <LottieView style={SPINNER} source={require("./spinner.json")} autoPlay loop />
            </Animated.View>
          </Animated.View>
        </View>
      )}
    </>
  )
})
