import React from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import { DishChef as DishChefModel } from "../../models/dish-store"
import { utilSpacing } from "../../theme/Util"
import { Image } from "../image/image"
import { Price } from "../price/price"
import { Text } from "../text/text"

export interface DishChefProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Dish to render
   */
  dish: DishChefModel

  /**
   * onPress callback
   */
  onPress?: () => void

  /**
   * Currency code from chef
   */
  currencyCode?: string
}

/**
 * Dish for chef
 */
export const DishChef = function DishChef(props: DishChefProps) {
  const { style, dish, onPress, currencyCode } = props

  return (
    <Ripple
      rippleOpacity={0.2}
      rippleDuration={400}
      onPress={onPress}
      style={[styles.containerFavoriteImageDish, utilSpacing.my4, utilSpacing.mr4, style]}
    >
      <Image style={styles.image} source={{ uri: dish.image }}></Image>
      <Text
        preset="semiBold"
        numberOfLines={1}
        style={[utilSpacing.mt3, styles.title]}
        text={dish.title}
      ></Text>
      <Price style={utilSpacing.mt3} amount={dish.price} currencyCode={currencyCode}></Price>
    </Ripple>
  )
}

const styles = StyleSheet.create({
  containerFavoriteImageDish: {
    width: 150,
  },
  image: {
    borderRadius: 16,
    height: 110,
    width: 150,
  },
  title: {
    lineHeight: 20,
  },
})
