import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import images from "../../assets/images"
import { Category } from "../../models/category-store"
import { utilSpacing } from "../../theme/Util"
import { Image } from "../image/image"
import { Text } from "../text/text"

export interface CategoriesProps {
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
export const Categories = function Categories(props: CategoriesProps) {
  const { onPress, categories = [] } = props

  return (
    <View>
      <Text size="lg" tx="categories.title" style={utilSpacing.ml4} preset="bold"></Text>
      <ScrollView horizontal style={[styles.flex, utilSpacing.mt3]}>
        {categories.map((category, index) => (
          <Ripple
            onPress={() => onPress(category)}
            rippleOpacity={0.2}
            rippleDuration={400}
            rippleContainerBorderRadius={16}
            key={category.id}
            style={[utilSpacing.p4, styles.containerCategoryItem, index === 0 && utilSpacing.ml4]}
          >
            <Image
              defaultSource={images.category}
              style={styles.imgCategory}
              source={{ uri: category.image }}
            ></Image>
            <Text style={utilSpacing.mt3} text={category.name}></Text>
          </Ripple>
        ))}
      </ScrollView>
    </View>
  )
}

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
