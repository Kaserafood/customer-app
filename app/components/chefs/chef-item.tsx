import images from "assets/images"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import PagerView from "react-native-pager-view"
import { AutoImage, Price, Separator, Text } from ".."
import { Dish } from "../../models/dish"
import { UserChef } from "../../models/user-store/user-store"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

export interface ChefItemModel extends UserChef {
  category: string
  currentDishName: string
  pageView: any
  currentIndexPage: number
}
export interface ChefItemProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Item to render
   */
  item: ChefItemModel

  /**
   * Callback on previous dihs
   */
  onPrevious?: () => void

  /**
   * Callback on next dihs
   */
  onNext?: () => void

  /**
   * Callback on change position with scroll
   */
  onChangePosition?: (index: number) => void

  /**
   * onDishPress callback
   */
  onDishPress?: (dish: Dish) => void
}

/**
 * Chef item Pager
 */
export const ChefItem = observer(function ChefItem(props: ChefItemProps) {
  const { style, item, onPrevious, onNext, onChangePosition, onDishPress } = props

  return (
    <View style={style} key={item.id}>
      <View style={styles.imageCarousel}>
        {item.currentIndexPage > 0 && (
          <TouchableOpacity
            onPress={onPrevious}
            activeOpacity={0.5}
            style={[
              styles.buttonCarousel,
              styles.buttonLeftCarouse,
              styles.btnPrevious,
              utilSpacing.mr2,
            ]}
          >
            <AutoImage style={styles.icon} source={images.previous}></AutoImage>
          </TouchableOpacity>
        )}

        <PagerView
          onPageSelected={(e) => onChangePosition(e?.nativeEvent?.position)}
          initialPage={0}
          ref={(c) => {
            item.pageView = c
          }}
          style={[styles.pagerView, styles.dish]}
        >
          {item.dishes.map((dish) => (
            <Ripple
              key={dish.id}
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => onDishPress(dish)}
              style={styles.dish}
            >
              <Image style={[styles.dish, styles.imageDish]} source={{ uri: dish.image }}></Image>
            </Ripple>
          ))}
        </PagerView>

        {item.currentIndexPage < item.dishes.length - 1 && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onNext}
            style={[styles.buttonCarousel, styles.btnNext, utilSpacing.ml2]}
          >
            <AutoImage style={styles.icon} source={images.next}></AutoImage>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.flex, styles.footer]}>
        <View style={styles.flex1}>
          <Text
            numberOfLines={1}
            text={`${item.name} ${item.currentIndexPage.toString()}`}
            preset="bold"
          ></Text>
          <Text numberOfLines={1} text={item.currentDishName}></Text>
          <View style={styles.flex}>
            <Text
              numberOfLines={1}
              style={[styles.flex1, styles.textCategory, utilSpacing.mr2]}
              text={item.category}
            ></Text>
            <Price preset="delivery" amount={30} style={utilSpacing.mr3}></Price>
          </View>
        </View>
        <View>
          <AutoImage style={styles.imageChef} source={{ uri: item.image }}></AutoImage>
        </View>
      </View>

      <Separator style={utilSpacing.mb5}></Separator>
    </View>
  )
})

const styles = StyleSheet.create({
  btnNext: {
    right: 0,
  },
  btnPrevious: {
    left: 0,
  },
  buttonCarousel: {
    backgroundColor: color.palette.blackTransparent,
    borderRadius: 100,
    marginHorizontal: spacing[2],
    padding: spacing[2],
    position: "absolute",
    zIndex: 20,
  },
  buttonLeftCarouse: {
    zIndex: 100,
  },

  dish: {
    borderRadius: spacing[2],
    flex: 1,
    height: 200,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  footer: {
    alignItems: "flex-end",

    top: -28,
  },
  icon: {
    height: 24,
    width: 24,
  },
  imageCarousel: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    height: 200,

    width: "100%",
  },

  imageChef: {
    borderColor: color.palette.white,
    borderRadius: spacing[2],
    borderWidth: 2,
    height: 90,
    width: 90,
  },
  imageDish: {
    width: "100%",
  },
  pagerView: {
    alignSelf: "center",
    display: "flex",
    flex: 1,
    width: "75%",
  },

  textCategory: {
    color: color.palette.grayDark,
  },
})
