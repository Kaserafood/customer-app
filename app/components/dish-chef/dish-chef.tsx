import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { Price } from "../price/price"
import { AutoImage } from "../auto-image/auto-image"
import { utilSpacing, utilFlex } from "../../theme/Util"
import images from "../../assets/images"
import { DishChef as DishChefModel } from "../../models/dish-store"
import { UserChef } from "../../models/user-store"
import Ripple from "react-native-material-ripple"

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
}

/**
 * Dish for chef
 */
export const DishChef = observer(function DishChef(props: DishChefProps) {
  const { style, dish, onPress } = props

  return (
    <Ripple
      rippleOpacity={0.2}
      rippleDuration={400}
      onPress={onPress}
      style={[styles.containerFavoriteImageDish, utilSpacing.my4, utilSpacing.mr4, style]}
    >
      <AutoImage style={styles.image} source={{ uri: dish.image }}></AutoImage>
      <Text preset="semiBold" numberOfLines={1} style={utilSpacing.mt3} text={dish.title}></Text>
      <Price style={utilSpacing.mt2} amount={dish.price}></Price>
    </Ripple>
  )
})

const styles = StyleSheet.create({
  containerFavoriteImageDish: {
    width: 150,
  },
  image: {
    borderRadius: 16,
    height: 110,
    width: 150,
  },
})
