import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getFormat } from "../../utils/price"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"

const CONTAINER: ViewStyle = {
  alignSelf: "flex-end",
  backgroundColor: color.palette.greenLight,
  borderRadius: 100,
  paddingHorizontal: spacing[4],
  paddingBottom: spacing[1],
}

export interface PriceProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Amount of price.
   */

  amount: number

  /**
   * Currency code .
   */
  currencyCode?: string

  /**
   * Preset of price.
   */
  preset?: "delivery" | "dish" | "simple"

  /**
   * Styles for price text.
   */
  textStyle?: StyleProp<TextStyle>
}

/**
 * Component to show prices.
 */

export const Price = observer(function Price(props: PriceProps) {
  const { style, amount, preset = "dish", textStyle, currencyCode } = props

  const price = getFormat(amount, currencyCode)
  const Delivery = () => {
    return (
      <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, style]}>
        <Icon name="moped" size={15} color={color.text} style={utilSpacing.mr2}></Icon>
        <Text style={textStyle} text={`${price}`}></Text>
      </View>
    )
  }

  const Dish = () => {
    const price = getFormat(amount, currencyCode)
    const styles = [CONTAINER, style]
    return (
      <View style={styles}>
        <Text style={textStyle} text={`${price}`}></Text>
      </View>
    )
  }

  const Simple = () => {
    const price = getFormat(amount, currencyCode)
    return <Text style={textStyle} text={`${price}`} preset="bold"></Text>
  }

  if (preset === "delivery") return <Delivery></Delivery>
  else if (preset === "dish") return <Dish></Dish>
  else return <Simple></Simple>
})
