import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { Price } from "../price/price"
import { AutoImage } from "../auto-image/auto-image"
import { utilSpacing } from "../../theme/Util"
import images from "assets/images"

export interface DishChefProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Dish for chef
 */
export const DishChef = observer(function DishChef(props: DishChefProps) {
  const { style } = props

  return (
    <View style={[styles.containerFavoriteImageDish, utilSpacing.m4, style]}>
      <AutoImage style={styles.image} source={images.dish2}></AutoImage>
      <Text preset="bold" numberOfLines={1} tx="placeholder.dishTitle"></Text>
      <View style={[styles.flex, utilSpacing.mt3]}>
        <Text tx="mainScreen.of"></Text>
        <Text tx="placeholder.chefName" numberOfLines={1} style={styles.flex1}></Text>
        <Price amount={32}></Price>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  containerFavoriteImageDish: {
    width: 150,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  image: {
    borderRadius: 16,
    height: 110,
    width: 150,
  },
})
