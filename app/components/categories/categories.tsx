import * as React from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { utilSpacing } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"
import Images from "assets/images"

export interface CategoriesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Categories food
 */
export const Categories = observer(function Categories(props: CategoriesProps) {
  const { style } = props

  return (
    <View style={style}>
      <Text size="lg" tx="categories.title" preset="bold"></Text>
      <ScrollView horizontal style={[styles.flex, utilSpacing.mt3]}>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.hamburger}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.hamburguer"></Text>
        </View>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.nikkei}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.nikkei"></Text>
        </View>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.pizzas}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.pizza"></Text>
        </View>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.hamburger}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.hamburguer"></Text>
        </View>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.nikkei}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.nikkei"></Text>
        </View>
        <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
          <AutoImage style={styles.imgCategory} source={Images.pizzas}></AutoImage>
          <Text style={utilSpacing.mt3} tx="mainScreen.pizza"></Text>
        </View>
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  containerCategoryItem: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  imgCategory: {
    height: 65,
    width: 65,
  },
})
