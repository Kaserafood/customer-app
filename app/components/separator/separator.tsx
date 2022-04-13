import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"

const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.whiteGray,
  borderRadius: 100,
  height: 3,
}

export interface SeparatorProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Separator = observer(function Separator(props: SeparatorProps) {
  const { style } = props

  return <View style={[CONTAINER, style]}></View>
})
