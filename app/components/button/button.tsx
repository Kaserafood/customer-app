import * as React from "react"
import { TouchableOpacity } from "react-native"

import { Text } from "../text/text"

import { textPresets, viewPresets } from "./button.presets"
import { ButtonProps } from "./button.props"

export function Button(props: ButtonProps) {
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    rounded,
    block,
    disabled,
    ...rest
  } = props

  const viewStyle = viewPresets[preset] || viewPresets.primary
  if (block) {
    viewStyle.width = "100%"
  } else viewStyle.width = 175

  if (preset === "link") {
    viewStyle.width = 35
    viewStyle.height = 35
  }

  if (rounded) {
    viewStyle.borderRadius = 100
  } else {
    viewStyle.borderRadius = 8
  }
  if (disabled) viewStyle.opacity = 0.5
  else viewStyle.opacity = 1

  const viewStyles = [viewStyle, styleOverride]
  const textStyle = textPresets[preset] || textPresets.primary
  const textStyles = [textStyle, textStyleOverride]

  const content = children || <Text tx={tx} text={text} style={textStyles} />

  __DEV__ && console.log("Button", preset, viewStyle.width)
  return (
    <TouchableOpacity style={viewStyles} {...rest} disabled={disabled === true} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  )
}
