import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import Ripple from "react-native-material-ripple"
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

  /**
   * onPress card
   */
  onPress?: () => void
}

/**
 * View with rounded corners and shadow
 */
export const Card = function Card(props: CardProps) {
  const { style, children, onPress } = props

  if (onPress) {
    return (
      <Ripple
        onPress={onPress}
        rippleOpacity={0.2}
        rippleDuration={400}
        style={[styles.card, style]}
      >
        {children}
      </Ripple>
    )
  }

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
