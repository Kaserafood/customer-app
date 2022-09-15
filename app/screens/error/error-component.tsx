import React, { ErrorInfo } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Icon, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

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
    <View style={[CONTAINER, utilFlex.flexCenter, utilSpacing.p7]}>
      <Icon
        name="plug-circle-xmark"
        size={70}
        color={color.text}
        style={[utilFlex.selfCenter, utilSpacing.mb7]}
      ></Icon>
      <Text preset="bold" size="lg" style={FRIENDLY_SUBTITLE} tx={"errorScreen.friendlySubtitle"} />
      {__DEV__ && (
        <View style={ERROR_DETAILS_CONTAINER}>
          <ScrollView>
            <Text selectable style={CONTENT_ERROR} text={`${props.error}`} />
            <Text selectable text={`${props.errorInfo.componentStack}`} />
          </ScrollView>
        </View>
      )}

      <Button
        block
        style={[BTN_RESET, utilSpacing.mt5]}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
    </View>
  )
}
