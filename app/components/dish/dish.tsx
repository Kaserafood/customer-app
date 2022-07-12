import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import { useStores } from "../../models"
import { DishChef as DishModel } from "../../models/dish-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Image } from "../image/image"
import { Price } from "../price/price"
import { Text } from "../text/text"

export interface DishProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Dish item
   */
  dish: DishModel

  /**
   * onPress callback
   */
  onPress?: () => void

  /**
   * visible chef image
   */
  visibleChefImage?: boolean

  /**
   * Visible price delivery
   */
  visiblePriceDelivery?: boolean

  /**
   * Currency code from chef
   */
  currencyCode?: string
}

/**
 * Describe your component here
 */
export const Dish = observer(function Dish(props: DishProps) {
  const {
    style,
    dish,
    onPress,
    visibleChefImage = true,
    visiblePriceDelivery = true,
    currencyCode,
  } = props
  const { orderStore } = useStores()

  return (
    <Ripple
      style={[utilSpacing.py3, style]}
      rippleOpacity={0.2}
      rippleDuration={400}
      onPress={onPress}
    >
      <View style={utilFlex.flexRow}>
        <View style={[styles.column, styles.containerTextDish, !visibleChefImage && styles.h100]}>
          <View style={utilFlex.flex1}>
            <Text
              text={dish.title}
              style={utilSpacing.mb2}
              numberOfLines={2}
              preset="semiBold"
            ></Text>
            <Text
              text={dish.description}
              size="sm"
              style={utilFlex.flex1}
              caption
              numberOfLines={2}
            ></Text>
            {visibleChefImage && (
              <Text
                style={[styles.chefDish, utilSpacing.mt4, utilSpacing.mb2]}
                size="sm"
                text={dish.chef.name}
              ></Text>
            )}
          </View>

          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Price
              amount={dish.price}
              style={utilSpacing.mr3}
              currencyCode={currencyCode || dish.chef.currencyCode}
            ></Price>
            {visiblePriceDelivery && (
              <Price
                currencyCode={currencyCode || dish.chef.currencyCode}
                amount={orderStore.priceDelivery}
                preset="delivery"
              ></Price>
            )}
          </View>
        </View>
        <View style={[styles.column, !visibleChefImage && styles.h120]}>
          <Image
            style={[styles.imageDish, !visibleChefImage && styles.h100]}
            source={{ uri: dish.image }}
          ></Image>
          {visibleChefImage && (
            <Image style={styles.imageChef} source={{ uri: dish.chef.image }}></Image>
          )}
        </View>
      </View>
    </Ripple>
  )
})

const styles = StyleSheet.create({
  chefDish: {
    alignSelf: "flex-start",
    color: color.palette.grayDark,
    marginBottom: spacing[0],
  },
  column: {
    height: 155,
  },
  containerTextDish: {
    flex: 1,
    marginRight: spacing[3],
  },

  h100: {
    height: 120,
  },
  h120: {
    height: 125,
  },
  imageChef: {
    borderColor: color.palette.white,
    borderRadius: 16,
    borderWidth: 1,
    bottom: 15,
    height: 45,
    position: "absolute",
    right: spacing[1],
    width: 45,
  },
  imageDish: {
    borderRadius: 8,
    height: 114,
    width: 160,
  },
})
