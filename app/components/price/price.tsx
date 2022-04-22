import * as React from "react"
import { ImageStyle, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { AutoImage } from "../auto-image/auto-image"
import images from "assets/images"
import { utilSpacing, utilFlex } from "../../theme/Util"
import { getFormat } from "../../utils/price"

const CONTAINER: ViewStyle = {
  alignSelf: "flex-end",
  backgroundColor: color.palette.greenLigth,
  borderRadius: 100,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[0],
}

const CONTAINER_DELIVERY: ViewStyle = {
  alignSelf: "flex-end",
}
const IMAGE: ImageStyle = {
  height: 18,
  width: 18,
}

type currency = "USD" | "GTQ"

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
        <AutoImage source={images.iconShipping} style={[utilSpacing.mr2, IMAGE]}></AutoImage>
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
