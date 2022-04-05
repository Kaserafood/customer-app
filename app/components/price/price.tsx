import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"

const CONTAINER: ViewStyle = {
  alignSelf: "flex-start",
  backgroundColor: color.palette.greenLigth,
  borderRadius: 100,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[0],
}

const TEXT: TextStyle = {
  marginBottom: -4,
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
   * Currency of price.
   */
  currency?: string
}

/**
 * Price of dish.
 */
export const Price = observer(function Price(props: PriceProps) {
  const { style, amount, currency = "Q" } = props
  const styles = Object.assign({}, CONTAINER, style)

  let price = ""
  if (amount.toFixed(2).split(".")[1] === "00") {
    price = amount.toFixed(0)
  } else {
    price = amount.toFixed(2)
  }

  return (
    <View style={styles}>
      <Text style={TEXT} text={`${currency}${price}`}></Text>
    </View>
  )
})
