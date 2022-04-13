import * as React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle, Image } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { CheckboxProps } from "./checkbox.props"
import SvgUri from "react-native-svg-uri"
import images from "assets/images"

const viewPresets: Record<string, ViewStyle> = {
  /**
   * Checkbox small and color black
   */
  tiny: {
    height: 20,
    width: 20,
    borderColor: color.palette.black,
    borderWidth: 1,
  },
}

const iconsPreset: Record<string, any> = {
  default: images.check,
  tiny: images.checkTiny,
}
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[1],
  alignSelf: "flex-start",
}

const DIMENSIONS = { width: 30, height: 30 }

const OUTLINE: ViewStyle = {
  ...DIMENSIONS,

  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2,
  borderColor: color.palette.green,
  borderRadius: spacing[0],
  padding: spacing[1],
}

const CONTAINER_CHECK: ViewStyle = {
  margin: spacing[1],
}

const LABEL: TextStyle = { paddingLeft: spacing[2] }

export function Checkbox(props: CheckboxProps) {
  const { preset = "default", rounded, style } = props
  const numberOfLines = props.multiline ? 0 : 1
  const roundedStyle: ViewStyle = {}
  if (rounded) {
    roundedStyle.borderRadius = 100
    roundedStyle.height = 19
    roundedStyle.width = 19
  }
  const rootStyle = [ROOT, style]
  const outlineStyle = [OUTLINE, viewPresets[preset], roundedStyle, props.outlineStyle]

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
            {preset === "default" && <SvgUri width="25" height="25" source={iconsPreset[preset]} />}

            {preset === "tiny" && <SvgUri width="15" height="15" source={iconsPreset[preset]} />}
          </View>
        )}
      </View>
      <Text text={props.text} tx={props.tx} numberOfLines={numberOfLines} style={LABEL} />
    </TouchableOpacity>
  )
}
