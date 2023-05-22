import React from "react"
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import PagerView from "react-native-pager-view"
import Icon from "react-native-vector-icons/FontAwesome"
import { observer } from "mobx-react-lite"

import { Price, Text } from "../../components"
import { UserChef } from "../../models/user-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

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
   * Callback on previous dish
   */
  onPrevious?: () => void

  /**
   * Callback on next dish
   */
  onNext?: () => void

  /**
   * Callback on change position with scroll
   */
  onChangePosition?: (index: number) => void

  /**
   * Callback on press chef image
   */
  onChefPress?: () => void
}

/**
 * Chef item Pager
 */
export const ChefItem = observer(function ChefItem(props: ChefItemProps) {
  const { style, item, onPrevious, onNext, onChangePosition, onChefPress } = props

  return (
    <View style={style} key={item.id}>
      <View style={styles.imageCarousel}>
        {item.currentIndexPage > 0 && (
          <TouchableOpacity
            onPress={onPrevious}
            activeOpacity={0.5}
            style={[styles.buttonCarousel, styles.buttonLeftCarouse, styles.btnPrevious]}
          >
            <Icon
              name="angle-left"
              size={30}
              style={utilSpacing.mr2}
              color={color.palette.white}
            ></Icon>
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
              onPress={() => onChefPress()}
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
            style={[styles.buttonCarousel, styles.btnNext]}
          >
            <Icon
              name="angle-right"
              size={30}
              style={utilSpacing.ml2}
              color={color.palette.white}
            ></Icon>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.flex, styles.footer]}>
        <View style={[utilFlex.flex1, styles.textContainer, utilSpacing.pt3]}>
          <Text numberOfLines={1} text={`${item.name}`} preset="bold"></Text>
          <Text style={styles.textDescription} numberOfLines={1} text={item.currentDishName}></Text>
          <View style={styles.flex}>
            <Text
              caption
              numberOfLines={1}
              style={[utilFlex.flex1, utilSpacing.mr2]}
              text={item.category}
            ></Text>
            <Price
              preset="delivery"
              amount={item.priceDelivery}
              style={utilSpacing.mr3}
              currencyCode={item.currencyCode}
            ></Price>
          </View>
        </View>
        <Ripple rippleOpacity={0.2} rippleDuration={400} onPress={() => onChefPress()}>
          <Image style={styles.imageChef} source={{ uri: item.image }}></Image>
        </Ripple>
      </View>
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
    alignItems: "center",
    backgroundColor: color.palette.blackTransparent,
    borderRadius: 100,
    height: 40,
    justifyContent: "center",
    marginHorizontal: spacing[2],
    position: "absolute",
    width: 40,
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
    height: 94,
    width: 90,
  },
  imageDish: {
    width: "100%",
  },
  nameDish: {
    lineHeight: 25,
  },

  pagerView: {
    alignSelf: "center",
    display: "flex",
    flex: 1,
    width: "75%",
  },
  textContainer: {
    height: 70,
    justifyContent: "space-between",
  },
  textDescription: {
    lineHeight: 23,
  },
})
