import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { Icon } from ".."
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getFormat } from "../../utils/price"
import { Text } from "../text/text"

const CONTAINER: ViewStyle = {
  alignSelf: "flex-end",
  backgroundColor: color.palette.greenLigth,
  borderRadius: 100,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[0],
  paddingBottom: 2,
}

const CONTAINER_DELIVERY: ViewStyle = {
  alignSelf: "flex-end",
}

type currency = "GTQ"

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
  currency?: currency

  /**
   * Preset of price.
   */
  preset?: "delivery" | "dish"

  /**
   * Styles for price text.
   */
  textStyle?: StyleProp<TextStyle>
}

/**
 * Price of dish or delivery.
 */

export const Price = observer(function Price(props: PriceProps) {
  const { style, amount, currency = "GTQ", preset = "dish", textStyle } = props

  const price = getFormat(amount, currency)
  const Delivery = () => {
    return (
      <View style={[CONTAINER_DELIVERY, utilFlex.flexRow, style]}>
        <Icon name="delivery" size={18} color={color.text} style={utilSpacing.mr2}></Icon>
        <Text style={textStyle} text={`${price}`}></Text>
      </View>
    )
  }

  const Dish = () => {
    const styles = Object.assign({}, CONTAINER, style)
    return (
      <View style={styles}>
        <Text style={textStyle} text={`${price}`}></Text>
      </View>
    )
  }

  if (preset === "delivery") {
    return <Delivery></Delivery>
  } else {
    return <Dish></Dish>
  }
})
