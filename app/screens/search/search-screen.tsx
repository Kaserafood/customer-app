import React, { FC, useLayoutEffect } from "react"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar, StyleSheet, View } from "react-native"
import { utilFlex, utilSpacing } from "../../theme/Util"

import { AppEventsLogger } from "react-native-fbsdk-next"

import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { Card, Header, Image, ModalRequestDish, Screen, Text } from "../../components"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"

import { Category } from "../../models/category-store"
import { DishChef } from "../../models/dish-store"
import { ModalLocation } from "../../components/location/modal-location"
import { ModalSearch } from "./modal-search"
import { ModalStateHandler } from "../../utils/modalState"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import Ripple from "react-native-material-ripple"
import { StackScreenProps } from "@react-navigation/stack"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { color } from "../../theme"
import { goBack } from "../../navigators/navigation-utilities"
import images from "../../assets/images"
import { observer } from "mobx-react-lite"
import { spacing } from "../../theme/spacing"
import { useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"

const modalStateRequest = new ModalStateHandler()
const modalStateLocation = new ModalStateHandler()
const modalStateSearch = new ModalStateHandler()
export const SearchScreen: FC<StackScreenProps<NavigatorParamList, "search">> = observer(
  ({ navigation }) => {
    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    const {
      categoryStore: { categories },
      userStore,
      cartStore,
      commonStore,
      dishStore,
    } = useStores()

    const toCategory = (category: Category) => {
      AppEventsLogger.logEvent("categoryPress", 1, {
        id: category.id,
        name: category.name,
        description: "Se ha seleccionado una categoría en la ventana de 'Buscar'",
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const openRequestDish = () => {
      modalStateRequest.setVisible(true)
      AppEventsLogger.logEvent("openModalRequestDish", 1, {
        description: "Se ha abierto la ventana de solicitar un platillo",
      })
    }

    const toDetailDish = (dish: DishChef) => {
      if (cartStore.hasItems) cartStore.cleanItems()
      /**
       *it is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      navigation.navigate("dishDetail", {
        ...dish,
      })
    }

    return (
      <Screen preset="fixed" statusBar="dark-content" statusBarBackgroundColor={color.primary}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={color.primary} />
        <Header
          headerTx="searchScreen.title"
          titleStyle={[utilSpacing.pt2, utilSpacing.mb2]}
          onLeftPress={goBack}
        />
        <ScrollView style={styles.body}>
          <View style={utilSpacing.mb5}>
            <TouchableOpacity
              style={[
                styles.search,
                utilSpacing.py5,
                utilSpacing.px4,
                utilFlex.flexRow,
                utilSpacing.my5,
                utilFlex.flexCenterVertical,
                utilSpacing.mx3
              ]}
              onPress={() => modalStateSearch.setVisible(true)}
            >
              <Icon name="magnifying-glass" color={color.palette.grayDark} size={18}></Icon>
              <Text tx="searchScreen.searchPlaceholder" style={utilSpacing.ml3}></Text>
            </TouchableOpacity>

            {userStore.userId > 0 && (
              <Ripple rippleOpacity={0.2} rippleDuration={400} onPress={openRequestDish}>
                <Card style={styles.card}>
                  <View style={[utilFlex.flexRow, utilFlex.flexCenter]}>
                    <Image style={[utilSpacing.mr2, styles.image]} source={images.step1}></Image>
                    <Text
                      style={utilSpacing.mt4}
                      preset="semiBold"
                      numberOfLines={1}
                      tx="searchScreen.somethingDiferent"
                    ></Text>
                  </View>
                </Card>
              </Ripple>
            )}
          </View>

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
                      <Image
                        style={[utilSpacing.mr2, styles.image]}
                        source={{ uri: category.image }}
                      ></Image>
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
                        <Image
                          style={[utilSpacing.mr2, styles.image]}
                          source={{ uri: categories[index + 1]?.image }}
                        ></Image>
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
        <ModalRequestDish modalState={modalStateRequest}></ModalRequestDish>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <ModalSearch modalState={modalStateSearch} onDishPress={toDetailDish}></ModalSearch>
      </Screen>
    )
  },
)

const FocusAwareStatusBar = observer((props: any) => {
  const isFocused = useIsFocused()

  return isFocused ? <StatusBar {...props} /> : null
})

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "88%",
  },
  card: {
    alignItems: "center",
    borderRadius: spacing[3],
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
  search: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: spacing[2],
  },
  text: {
    lineHeight: 20,
  },
})
