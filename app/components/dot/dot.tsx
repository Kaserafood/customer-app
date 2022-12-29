import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

import { color } from "../../theme"

export interface DotProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Active state for the dot
   */
  active?: boolean
}

const DOT: ViewStyle = {
  width: 16,
  height: 16,
  borderRadius: 100,
}

export const Dot = observer(function Dot(props: DotProps) {
  const { style, active } = props
  if (active) {
    DOT.backgroundColor = color.palette.grayDark
  } else {
    DOT.backgroundColor = color.palette.grayLigth
  }
  const styles = Object.assign({}, DOT, style)

  return <View style={styles}></View>
})
