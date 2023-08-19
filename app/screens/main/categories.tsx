import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"

import { useQuery } from "react-query"
import images from "../../assets/images"
import { Image } from "../../components/image/image"
import { Text } from "../../components/text/text"
import { Category } from "../../models/category-store"
import { Api } from "../../services/api"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { useNavigation } from "@react-navigation/native"

interface Props {
  onPress: (category: Category) => void
}

/**
 * Categories food
 */
const Categories = ({ onPress }: Props) => {
  const api = new Api()
  const navigation = useNavigation()

  const { data } = useQuery("categories-main", () => api.getAllCategories(), {
    onSuccess: (data: { data: Category[]; kind: string }) => {
      return data
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handleCategory = (category) => {
    console.log(category)
    onPress(category)
  }

  const toSearch = () => {
    navigation.navigate("search" as never)
  }

  return (
    <View style={utilSpacing.p5}>
      <View style={styles.containerTitle}>
        <Text tx="mainScreen.homemadeStuff" preset="bold" size="lg"></Text>
        <View style={styles.bar}></View>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.my4]}>
        {data?.data?.slice(0, 3).map((category, index) => (
          <Ripple
            onPress={() => handleCategory(category)}
            rippleOpacity={0.2}
            rippleDuration={400}
            rippleContainerBorderRadius={16}
            key={category.id}
            style={[
              utilSpacing.p4,
              styles.containerCategoryItem,
              utilFlex.flex1,
              index !== 2 && utilSpacing.mr4,
            ]}
          >
            <Image
              defaultSource={images.category}
              style={styles.imgCategory}
              source={{ uri: category.image }}
            ></Image>
            <Text style={utilSpacing.mt3} text={category.name}></Text>
          </Ripple>
        ))}
      </View>
      <View style={utilFlex.flexRow}>
        {data?.data?.slice(4, 7).map((category, index) => (
          <Ripple
            key={category.id}
            onPress={() => (index !== 2 ? handleCategory(category) : toSearch())}
            rippleOpacity={0.2}
            rippleDuration={400}
            rippleContainerBorderRadius={16}
            style={[
              utilSpacing.p4,
              styles.containerCategoryItem,
              index !== 2 && utilSpacing.mr4,

              utilFlex.flex1,
            ]}
          >
            <View>
              {index !== 2 ? (
                <View>
                  <Image
                    defaultSource={images.category}
                    style={styles.imgCategory}
                    source={{ uri: category.image }}
                  ></Image>
                  <Text style={utilSpacing.mt3} text={category.name}></Text>
                </View>
              ) : (
                <View>
                  <Image style={styles.imgCategory} source={images.searching}></Image>
                  <Text
                    style={[utilSpacing.mt3, utilFlex.selfCenter]}
                    tx="mainScreen.seeMore"
                  ></Text>
                </View>
              )}
            </View>
          </Ripple>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: color.primary,
    height: 2,

    width: 55,
  },
  containerCategoryItem: {
    alignItems: "center",
    backgroundColor: color.background,
    borderColor: color.palette.white,
    borderRadius: spacing[2],
    borderWidth: 1,

    display: "flex",

    elevation: 12,
    shadowColor: color.palette.grayDark,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
  },

  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
  imgCategory: {
    height: 60,
    width: 60,
  },
})

export default Categories
