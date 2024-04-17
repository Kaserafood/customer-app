import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"

import { DishChef as DishModel } from "../../models/dish-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { Icon } from "../icon/icon"
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

  /**
   * Size text description from
   */
  sizeTextDescription?: "sm" | "md"
}

const mixpanel = getInstanceMixpanel()

/**
 * Component to display a dish
 */
export const Dish = observer(function Dish(props: DishProps) {
  const {
    style,
    dish,
    onPress,
    visibleChefImage = true,
    visiblePriceDelivery = true,
    currencyCode,
    sizeTextDescription = "sm",
  } = props

  const handlePress = () => {
    mixpanel.track("Dish item press", {
      dish: JSON.stringify(dish),
    })
    onPress?.()
  }

  return (
    <Ripple
      style={[utilSpacing.py3, utilSpacing.px5, dish.badge && styles.badge, style]}
      rippleOpacity={0.2}
      rippleDuration={400}
      onPress={handlePress}
    >
      <View style={utilFlex.flexRow}>
        <View style={[styles.column, styles.containerTextDish, !visibleChefImage && styles.h100]}>
          <View style={utilFlex.flex1}>
            <Text
              text={dish.title}
              style={utilSpacing.mb1}
              numberOfLines={2}
              preset="semiBold"
            ></Text>
            <Text
              text={dish.description}
              size={sizeTextDescription}
              style={utilFlex.flex1}
              caption
              numberOfLines={2}
            ></Text>
            {visibleChefImage && (
              <Text
                style={[styles.chefDish, utilSpacing.mb2]}
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
                amount={dish.chef?.priceDelivery}
                preset="delivery"
                style={{ backgroundColor: palette.amber600 }}
              ></Price>
            )}
          </View>
        </View>
        <View style={[styles.column, !visibleChefImage && styles.h120]}>
          <Image
            style={[styles.imageDish, !visibleChefImage && styles.h100]}
            source={{ uri: dish.imageThumbnail }}
          ></Image>
          {visibleChefImage && (
            <Image style={styles.imageChef} source={{ uri: dish.chef.image }}></Image>
          )}
        </View>

        {dish.badge && (
          <View style={[styles.containerIconStart, utilSpacing.px2, utilSpacing.py2]}>
            <Icon
              style={styles.iconStart}
              name="heart"
              size={18}
              color={color.palette.amber600}
            ></Icon>
          </View>
        )}
      </View>
    </Ripple>
  )
})

const styles = StyleSheet.create({
  badge: {
    backgroundColor: palette.amber50,
  },
  chefDish: {
    alignSelf: "flex-start",
    color: color.palette.grayDark,
    marginBottom: spacing[0],
  },
  column: {
    height: 125,
  },

  containerIconStart: {
    backgroundColor: color.palette.amber50,
    borderRadius: spacing[2],
    position: "absolute",
    right: 8,
    top: 8,
  },
  containerTextDish: {
    flex: 1,
    marginRight: spacing[3],
  },
  h100: {
    height: 105,
  },
  h120: {
    height: 110,
  },
  iconStart: {},
  imageChef: {
    borderColor: color.palette.white,
    borderRadius: 16,
    borderWidth: 1,
    bottom: 0,
    height: 45,
    position: "absolute",
    right: spacing[1],
    width: 45,
  },
  imageDish: {
    borderRadius: 8,
    height: 100,
    width: 140,
  },
})
