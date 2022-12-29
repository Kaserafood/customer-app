import * as React from "react"
import { Text as ReactNativeText, TextStyle } from "react-native"

import { translate } from "../../i18n"
import { color } from "../../theme"

import { fontSize, presets } from "./text.presets"
import { TextProps } from "./text.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const {
    preset = "default",
    tx,
    txOptions,
    text,
    children,
    style: styleOverride,
    size = "md",
    caption,
    ...rest
  } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = presets[preset] || presets.default
  const textSize = fontSize[size]
  let moreStyles: TextStyle = {}
  if (caption) {
    moreStyles = { color: color.palette.grayDark }
  }
  /**
   * We set a marginBottom when a marginVertical is set, because by default the text has a
   * marginBottom = -4 and that makes the marginVertical not work correctly
   */
  const styleObject: any = Object.assign([], styleOverride)
  if (styleObject.marginVertical) {
    moreStyles.marginBottom = styleObject.marginVertical
  }
  const styles = [style, textSize, moreStyles, styleOverride]
  return (
    <ReactNativeText {...rest} style={styles}>
      {content}
    </ReactNativeText>
  )
}
