import React, { useEffect } from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { utilSpacing } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"
import Images from "assets/images"
import { useStores } from "../../models"
import images from "../../assets/images"

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

  const { categoryStore } = useStores()

  const { categories } = categoryStore

  useEffect(() => {
    async function fectch() {
      await categoryStore.getAll()
    }
    fectch()
  }, [])

  return (
    <View style={style}>
      <Text size="lg" tx="categories.title" preset="bold"></Text>
      <ScrollView horizontal style={[styles.flex, utilSpacing.mt3]}>
        {categories.map((category) => (
          <View key={category.categoryId} style={[utilSpacing.p4, styles.containerCategoryItem]}>
            <AutoImage
              defaultSource={images.category}
              style={styles.imgCategory}
              source={{ uri: category.image }}
            ></AutoImage>
            <Text style={utilSpacing.mt3} text={category.name}></Text>
          </View>
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
