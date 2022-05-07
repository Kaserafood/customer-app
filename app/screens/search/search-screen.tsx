import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { AutoImage, Card, Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing } from "../../theme/Util"

export const SearchScreen: FC<StackScreenProps<NavigatorParamList, "search">> = observer(
  function SearchScreen({ navigation }) {
    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    const {
      categoryStore: { categories },
    } = useStores()

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    return (
      <Screen
        preset="scroll"
        style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <Header headerTx="search.title" onLeftPress={goBack} />
        <View style={[styles.body, utilSpacing.mt6]}>
          {categories.map(
            (category: Category, index: number) =>
              index % 2 === 0 && (
                <View key={category.id} style={[utilFlex.flexRow, utilSpacing.mb5, styles.row]}>
                  <Ripple
                    rippleOpacity={0.2}
                    rippleDuration={400}
                    onPress={() => toCategory(category)}
                    style={styles.containerCard}
                  >
                    <Card style={styles.card}>
                      <AutoImage
                        style={[utilSpacing.mr2, styles.image]}
                        source={{ uri: category.image }}
                      ></AutoImage>
                      <Text
                        style={utilSpacing.mt4}
                        preset="bold"
                        numberOfLines={1}
                        text={category.name}
                      ></Text>
                    </Card>
                  </Ripple>

                  {index < categories.length - 1 && (
                    <Ripple
                      rippleOpacity={0.2}
                      rippleDuration={400}
                      onPress={() => toCategory(categories[index + 1])}
                      style={styles.containerCard}
                    >
                      <Card style={styles.card}>
                        <AutoImage
                          style={[utilSpacing.mr2, styles.image]}
                          source={{ uri: categories[index + 1]?.image }}
                        ></AutoImage>
                        <Text
                          style={utilSpacing.mt4}
                          preset="bold"
                          numberOfLines={1}
                          text={categories[index + 1]?.name}
                        ></Text>
                      </Card>
                    </Ripple>
                  )}
                </View>
              ),
          )}
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",

    width: "80%",
  },
  card: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    padding: spacing[4],
  },
  container: {
    backgroundColor: color.background,
  },
  containerCard: {
    width: "46%",
  },
  image: {
    height: 100,
    width: 100,
  },
  row: {
    justifyContent: "space-between",
  },
})
