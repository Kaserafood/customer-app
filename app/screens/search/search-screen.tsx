import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import { StatusBar, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"

import images from "../../assets/images"
import { Card, Icon, Image, ModalRequestDish, Screen, Text } from "../../components"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { DishChef } from "../../models/dish-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

import RNUxcam from "react-native-ux-cam"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalSearch } from "./modal-search"

const modalStateRequest = new ModalStateHandler()
const modalStateLocation = new ModalStateHandler()
const modalStateSearch = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()

export const SearchScreen: FC<StackScreenProps<NavigatorParamList, "search">> = observer(
  ({ navigation, route: { params } }) => {
    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    const {
      categoryStore: { categories, getAll },
      userStore,
      cartStore,
      commonStore,
      dishStore,
    } = useStores()

    useEffect(() => {
      getAll()
      mixpanel.track("Search Screen")
    }, [])

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
      RNUxcam.logEvent("search: modalRequestDish")
      mixpanel.track("Open modal request dish")
      AppEventsLogger.logEvent("openModalRequestDish", 1, {
        description: "Se ha abierto la ventana de solicitar un platillo",
      })
    }

    const toDetailDish = (dish: DishChef) => {
      RNUxcam.logEvent("search: pressDish", {
        id: dish.id,
        name: dish.title,
        chefId: dish.chef.id,
        chefName: dish.chef.name,
      })

      mixpanel.track("Press dish in search screen", {
        id: dish.id,
        name: dish.title,
        chefId: dish.chef.id,
        chefName: dish.chef.name,
      })

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

    const onPressSearch = () => {
      modalStateSearch.setVisible(true)
      RNUxcam.logEvent("search: modalSearch")

      mixpanel.track("Open modal search in Search screen")
    }

    const onPressCategory = (category: Category) => {
      toCategory(category)
      RNUxcam.logEvent("search: category", {
        id: category.id,
        name: category.name,
      })

      mixpanel.track("Category press", {
        screen: "search",
        id: category.id,
        name: category.name,
      })
    }

    return (
      <Screen
        preset="fixed"
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <StatusBar barStyle="dark-content" backgroundColor={"transparent"} translucent></StatusBar>
        <ScrollView style={styles.body}>
          <View style={utilSpacing.my5}>
            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb5]}>
              {params?.showBackButton && (
                <TouchableOpacity style={styles.btnBack} onPress={goBack} activeOpacity={0.5}>
                  <Icon
                    name="angle-left-1"
                    style={utilSpacing.mr2}
                    size={24}
                    color={color.text}
                  ></Icon>
                </TouchableOpacity>
              )}

              <View style={utilFlex.flex1}>
                <TouchableOpacity
                  style={[
                    styles.search,
                    utilSpacing.py5,
                    utilSpacing.px4,
                    utilFlex.flexRow,

                    utilFlex.flexCenterVertical,
                    utilSpacing.mx3,
                  ]}
                  onPress={onPressSearch}
                >
                  <Icon name="magnifying-glass" color={color.palette.grayDark} size={18}></Icon>
                  <Text tx="searchScreen.searchPlaceholder" style={utilSpacing.ml3}></Text>
                </TouchableOpacity>
              </View>
            </View>

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
                    onPress={() => onPressCategory(category)}
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

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "88%",
  },
  btnBack: {
    alignItems: "center",
    backgroundColor: color.palette.gray300,
    borderRadius: 100,
    height: 38,
    justifyContent: "center",
    width: 38,
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
    borderRadius: spacing[3],
  },
  text: {
    lineHeight: 20,
  },
})
