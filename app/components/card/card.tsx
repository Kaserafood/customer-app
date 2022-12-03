import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"
import { SHADOW } from "../../theme/Util"

export interface CardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Content card
   */
  children: React.ReactNode
}

/**
 * Describe your component here
 */
export const Card = function Card(props: CardProps) {
  const { style, children } = props

  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.background,
    borderRadius: spacing[2],
    padding: spacing[2],
    ...SHADOW,
  },
})
