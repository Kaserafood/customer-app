import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import images from "../../assets/images"
import { AutoImage, Card, Header, ModalRequestDish, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

const modalState = new ModalStateHandler()
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
      <>
        <Screen
          preset="fixed"
          style={styles.container}
          statusBar="dark-content"
          statusBarBackgroundColor={color.palette.white}
        >
          <Header
            headerTx="searchScreen.title"
            titleStyle={[utilSpacing.pt4, utilSpacing.mb2]}
            onLeftPress={goBack}
          />
          <ScrollView style={styles.body}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={[utilSpacing.mb5, utilSpacing.mt7]}
              onPress={() => modalState.setVisible(true)}
            >
              <Card style={styles.card}>
                <View style={[utilFlex.flexRow, utilFlex.flexCenter]}>
                  <AutoImage
                    style={[utilSpacing.mr2, styles.image]}
                    source={images.step1}
                  ></AutoImage>
                  <Text
                    style={utilSpacing.mt4}
                    preset="semiBold"
                    numberOfLines={1}
                    tx="searchScreen.somethingDiferent"
                  ></Text>
                </View>
              </Card>
            </Ripple>

            {categories.map(
              (category: Category, index: number) =>
                index % 2 === 0 && (
                  <View key={category.id} style={[utilFlex.flexRow, utilSpacing.mb6, styles.row]}>
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
                        <View style={[utilFlex.flexCenter, utilFlex.flex1]}>
                          <Text
                            style={[utilSpacing.mt4, styles.text]}
                            preset="semiBold"
                            numberOfLines={2}
                            text={category.name}
                          ></Text>
                        </View>
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
                          <View style={[utilFlex.flexCenter, utilFlex.flex1]}>
                            <Text
                              style={[utilSpacing.mt4, styles.text]}
                              preset="semiBold"
                              numberOfLines={2}
                              text={categories[index + 1]?.name}
                            ></Text>
                          </View>
                        </Card>
                      </Ripple>
                    )}
                  </View>
                ),
            )}
          </ScrollView>
          <ModalRequestDish modalState={modalState}></ModalRequestDish>
        </Screen>
      </>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    minWidth: 300,
    width: "88%",
  },
  card: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    marginHorizontal: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[4],
  },
  container: {
    backgroundColor: color.background,
  },
  containerCard: {
    width: "48%",
  },
  image: {
    height: 100,
    width: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  text: {
    lineHeight: 20,
  },
})
