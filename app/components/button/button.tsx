import * as React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import { Text } from "../text/text"

import { spacing, typography } from "../../theme"
import { textPresets, viewPresets } from "./button.presets"
import { ButtonProps } from "./button.props"

const Button = (props: ButtonProps) => {
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
    iconLeft,
    iconRight,
    size = "md",
    ...rest
  } = props

  const viewStyle = viewPresets[preset] || viewPresets.primary

  const viewStyles = [viewStyle, disabled ? { opacity: 0.5 } : { opacity: 1 }]

  const textStyle = textPresets[preset] || textPresets.primary

  const textStyles = [textStyle, textStyleOverride]

  const content = children || (
    <Text
      tx={tx}
      text={text}
      style={[textStyles, size === "sm" && { fontFamily: typography.primarySemiBold }]}
    />
  )

  __DEV__ && console.log("Button", preset, viewStyle.width)
  return (
    <TouchableOpacity
      style={[
        viewStyles,
        size === "sm" && styles.sm,
        block && styles.block,
        rounded && styles.rounded,
        styleOverride,
      ]}
      {...rest}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {iconLeft && iconLeft}
      {content}
      {iconRight && iconRight}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
  },
  rounded: {
    borderRadius: 100,
  },
  sm: {
    borderRadius: spacing[2],
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
    width: "auto",
  },
})

export { Button }
