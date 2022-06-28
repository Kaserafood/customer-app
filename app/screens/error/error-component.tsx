import React, { ErrorInfo } from "react"
import { ImageStyle, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Button, Text } from "../../components"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"

const CONTAINER: ViewStyle = {
  alignItems: "center",
  flex: 1,
  padding: 16,
  paddingVertical: 50,
  backgroundColor: color.background,
}

const ERROR_DETAILS_CONTAINER: ViewStyle = {
  width: "100%",
  maxHeight: "60%",
  backgroundColor: color.palette.white,
  marginVertical: 15,
  paddingHorizontal: 10,
  paddingBottom: 15,
  borderRadius: 6,
}

const BTN_RESET: ViewStyle = {
  paddingHorizontal: 40,

  backgroundColor: color.primary,
}

const TITLE_ERROR: TextStyle = {
  color: color.error,
  fontWeight: "bold",
  paddingVertical: 15,
}

const FRIENDLY_SUBTITLE: TextStyle = {
  color: color.palette.black,
  fontWeight: "normal",
  paddingVertical: 15,
}

const CONTENT_ERROR: TextStyle = {
  color: color.error,
  fontWeight: "bold",
  paddingVertical: 15,
}

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
// const CONTENT_BACKTRACE: TextStyle = {
//   color: color.dim,
// }

const ICON: ImageStyle = {
  marginTop: 30,
  width: 64,
  height: 64,
}

export interface ErrorComponentProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

/**
 * Show the error message
 */
export const ErrorComponent = (props: ErrorComponentProps) => {
  return (
    <View style={CONTAINER}>
      <IconRN style={utilSpacing.my5} name="bug-report" light size={70} color={color.primary} />
      <Text style={TITLE_ERROR} tx={"errorScreen.title"} />
      <Text style={FRIENDLY_SUBTITLE} tx={"errorScreen.friendlySubtitle"} />
      <View style={ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          {/* Algo no ha funcionado como se esperaba (Button -> Reestablecer) */}
          <Text selectable style={CONTENT_ERROR} text={`${props.error}`} />
          {__DEV__ && <Text selectable text={`${props.errorInfo.componentStack}`} />}
        </ScrollView>
      </View>
      <Button block style={BTN_RESET} onPress={props.onReset} tx="errorScreen.reset" />
    </View>
  )
}
