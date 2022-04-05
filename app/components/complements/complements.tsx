import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Text } from "../text/text"
import { Checkbox } from "../checkbox/checkbox"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { presets } from "../text/text.presets"
import { useState } from "react"
import Ripple from "react-native-material-ripple"

export interface ComplementsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Complements = observer(function Complements(props: ComplementsProps) {
  const { style } = props

  const [selected, setSelected] = useState(false)

  return (
    <View style={[style, utilSpacing.m4]}>
      <Text preset="bold" text="Selecciona tus acompañamientos"></Text>
      <Ripple
        rippleOpacity={0.2}
        onPress={() => setSelected(!selected)}
        style={[styles.card, utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb2]}
      >
        <Checkbox onToggle={() => setSelected(!selected)} preset="tiny" value={selected}></Checkbox>
        <Text preset="bold" size="sm" style={utilFlex.flex1} text="Ensadlda de frutas"></Text>
        <Text size="sm" text="+Q5"></Text>
      </Ripple>
      <Ripple
        rippleOpacity={0.2}
        onPress={() => setSelected(!selected)}
        style={[styles.card, utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb2]}
      >
        <Checkbox onToggle={() => setSelected(!selected)} preset="tiny" value={selected}></Checkbox>
        <Text preset="bold" size="sm" style={utilFlex.flex1} text="Ensadlda de frutas"></Text>
        <Text size="sm" text="+Q5"></Text>
      </Ripple>
      <Ripple
        rippleOpacity={0.2}
        onPress={() => setSelected(!selected)}
        style={[styles.card, utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb2]}
      >
        <Checkbox onToggle={() => setSelected(!selected)} preset="tiny" value={selected}></Checkbox>
        <Text preset="bold" size="sm" style={utilFlex.flex1} text="Ensadlda de frutas"></Text>
      </Ripple>
      <Ripple
        rippleOpacity={0.2}
        onPress={() => setSelected(!selected)}
        style={[styles.card, utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb2]}
      >
        <Checkbox onToggle={() => setSelected(!selected)} preset="tiny" value={selected}></Checkbox>
        <Text preset="bold" size="sm" style={utilFlex.flex1} text="Ensadlda de frutas"></Text>
      </Ripple>
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.palette.white,
    borderRadius: 8,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    ...SHADOW,
  },
})
