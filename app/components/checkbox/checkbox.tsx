import * as React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle, Image } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { CheckboxProps } from "./checkbox.props"
import SvgUri from "react-native-svg-uri"

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[1],
  alignSelf: "flex-start",
}

const DIMENSIONS = { width: 30, height: 30 }

const OUTLINE: ViewStyle = {
  ...DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2,
  borderColor: color.palette.greenLigth,
  borderRadius: spacing[0],
  padding: spacing[1],
}

const CONTAINER_CHECK: ViewStyle = {
  margin: spacing[1],
}

const LABEL: TextStyle = { paddingLeft: spacing[2] }

export function Checkbox(props: CheckboxProps) {
  const numberOfLines = props.multiline ? 0 : 1

  const rootStyle = [ROOT, props.style]
  const outlineStyle = [OUTLINE, props.outlineStyle]

  const onPress = props.onToggle ? () => props.onToggle && props.onToggle(!props.value) : null

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!props.onToggle}
      onPress={onPress}
      style={rootStyle}
    >
      <View style={outlineStyle}>
        {props.value && (
          <View style={CONTAINER_CHECK}>
            <SvgUri width="25" height="25" source={require("./icons/check.svg")} />
          </View>
        )}
      </View>
      <Text text={props.text} tx={props.tx} numberOfLines={numberOfLines} style={LABEL} />
    </TouchableOpacity>
  )
}
