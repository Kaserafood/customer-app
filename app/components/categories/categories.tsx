import React, { useEffect } from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { utilSpacing } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"
import Images from "assets/images"
import { useStores } from "../../models"
import images from "../../assets/images"
import { Category } from "../../models/category-store"
import Ripple from "react-native-material-ripple"

export interface CategoriesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Categories data
   */
  categories: Category[]

  /**
   * onPress the category
   */
  onPress?: (category: Category) => void
}

/**
 * Categories food
 */
export const Categories = observer(function Categories(props: CategoriesProps) {
  const { style, onPress, categories = [] } = props

  return (
    <View style={style}>
      <Text size="lg" tx="categories.title" preset="bold"></Text>
      <ScrollView horizontal style={[styles.flex, utilSpacing.mt3]}>
        {categories.map((category) => (
          <Ripple
            onPress={() => onPress(category)}
            key={category.categoryId}
            style={[utilSpacing.p4, styles.containerCategoryItem]}
          >
            <AutoImage
              defaultSource={images.category}
              style={styles.imgCategory}
              source={{ uri: category.image }}
            ></AutoImage>
            <Text style={utilSpacing.mt3} text={category.name}></Text>
          </Ripple>
        ))}
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
