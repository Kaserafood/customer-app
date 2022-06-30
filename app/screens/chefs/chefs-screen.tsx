import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import {
  Categories,
  Chip,
  DayDelivery,
  Loader,
  Location,
  ModalDeliveryDate,
  Screen,
  Separator,
  Text,
} from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { LocationModal } from "../../components/location/location-modal"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { Dish } from "../../models/dish"
import { UserChef } from "../../models/user-store"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { ChefItem, ChefItemModel } from "./chef-item"

class ModalState {
  isVisibleWhy = false
  data: ChefItemModel[] = []
  isVisibleLocation = false

  setVisibleLocation(state: boolean) {
    this.isVisibleLocation = state
  }

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  setData(data: ChefItemModel[]) {
    this.data = data
  }

  nextDish(item: ChefItemModel, index: number) {
    if (item.currentIndexPage < item.dishes.length - 1) {
      item.pageView.setPage(item.currentIndexPage + 1)

      item.currentDishName = item.dishes[item.currentIndexPage + 1].title
      item.currentIndexPage++
      this.data[index] = item
    }
  }

  previousDish(item: ChefItemModel, index: number) {
    if (item.currentIndexPage > 0) {
      item.pageView.setPage(item.currentIndexPage - 1)

      item.currentDishName = item.dishes[item.currentIndexPage - 1].title
      item.currentIndexPage--
      this.data[index] = item
    }
  }

  chanageDish(item: ChefItemModel, position: number, index: number) {
    if (item.currentIndexPage !== position) {
      item.pageView.setPage(position)
      item.currentIndexPage = position
      item.currentDishName = item.dishes[item.currentIndexPage].title
      this.data[index] = item
    }
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalState()
const modalDeliveryDate = new ModalStateHandler()
type Screen = "dishDetail" | "menuChef"
/**
 * Chef screen for show all chefs with dishes
 */
export const ChefsScreen: FC<StackScreenProps<NavigatorParamList, "chefs">> = observer(
  function ChefsScreen({ navigation }) {
    const { categoryStore, dayStore, dishStore, commonStore } = useStores()

    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    useEffect(() => {
      __DEV__ && console.log("chefs useEffect")
      commonStore.setVisibleLoading(true)
      async function fetch() {
        await dishStore
          .getGroupedByChef(dayStore.currentDay.date, RNLocalize.getTimeZone())
          .then(() => {
            modalState.setData(formatDishesGropuedByChef(dishStore.dishesGroupedByChef))
          })
          .finally(() => {
            commonStore.setVisibleLoading(false)
            __DEV__ && console.log("hide loaindg")
          })
      }

      fetch()
    }, [])

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const toScreen = (screen: Screen, dish: Dish, userChef: ChefItemModel) => {
      /**
       *it is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      const chef = {
        ...userChef,
      }
      delete chef.category
      delete chef.currentDishName
      delete chef.pageView
      delete chef.currentIndexPage
      navigation.push(screen, { ...dish, chef: { ...chef }, isGetMenu: screen === "menuChef" })
    }

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      modalState.setData([])
      dayStore.setCurrentDay(day)
      await dishStore
        .getGroupedByChef(day.date, RNLocalize.getTimeZone())
        .then(() => {
          if (dishStore.dishesGroupedByChef.length > 0) {
            modalState.setData(formatDishesGropuedByChef(dishStore.dishesGroupedByChef))
            __DEV__ && console.log("formatData changed")
          }
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }

    const formatDishesGropuedByChef = (dishes: UserChef[]) => {
      return dishes.map((chef: UserChef) => {
        return {
          ...chef,
          category: getCategoriesName(chef.categories),
          currentIndexPage: 0,
          pageView: null,
          currentDishName: chef.dishes.length > 0 ? chef.dishes[0]?.title : "",
        }
      })
    }

    const getCategoriesName = (categories: Category[]) => {
      let categoriesStr = ""
      if (categories && Array.isArray(categories)) {
        categories.forEach((category) => {
          categoriesStr += `${category.name} - `
        })
        return categoriesStr.substring(0, categoriesStr.length - 2)
      }

      return ""
    }

    return (
      <Screen
        preset="fixed"
        statusBar="dark-content"
        style={styles.container}
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView style={styles.container}>
          <Location
            onPress={() => {
              modalState.setVisibleLocation(true)
            }}
            style={utilSpacing.px4}
          ></Location>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => modalState.setVisibleWhy(state)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>
          <View style={utilSpacing.px4}>
            <Separator style={utilSpacing.my4}></Separator>
            <Categories
              categories={categoryStore.categories}
              onPress={(category) => toCategory(category)}
            ></Categories>
            <Separator style={utilSpacing.my4}></Separator>
            <View
              style={[
                utilFlex.flexRow,
                utilSpacing.mt3,
                utilSpacing.mb6,
                utilFlex.flexCenterVertical,
              ]}
            >
              <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
              <Chip
                active
                onPress={() => modalDeliveryDate.setVisible(true)}
                text={dayStore.currentDay.dayName}
                style={[utilSpacing.ml3, styles.chip]}
              ></Chip>
            </View>

            <ListChef toScreen={(screen, dish, chef) => toScreen(screen, dish, chef)}></ListChef>
          </View>
        </ScrollView>
        <LocationModal screenToReturn="main" modal={modalState}></LocationModal>
        <DayDeliveryModal modal={modalState}></DayDeliveryModal>
        <Loader visible={commonStore.isVisibleLoading}></Loader>
        <ModalDeliveryDate
          isAllGet
          modal={modalDeliveryDate}
          onSelectDay={(day) => onChangeDay(day)}
        ></ModalDeliveryDate>
      </Screen>
    )
  },
)

const ListChef = observer(function ListChef(props: {
  toScreen: (screen: Screen, dish: Dish, userChef: ChefItemModel) => void
}) {
  return (
    <View>
      {modalState.data.map((chef, index) => (
        <View key={chef.id}>
          <ChefItem
            onDishPress={(dish) => props.toScreen("dishDetail", dish, chef)}
            onChefPress={() => props.toScreen("menuChef", chef.dishes[0], chef)}
            onPrevious={() => modalState.previousDish(chef, index)}
            onNext={() => modalState.nextDish(chef, index)}
            onChangePosition={(position) => modalState.chanageDish(chef, position, index)}
            item={chef}
          ></ChefItem>
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    paddingTop: spacing[2],
  },
  chip: {
    borderRadius: spacing[3],
    marginRight: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
})
