import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import {
  Categories,
  DayDelivery,
  Loader,
  Location,
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
import { ChefItem, ChefItemModel } from "./chef-item"

class ModalState {
  isVisibleWhy = false
  data: ChefItemModel[] = []

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  setData(data: ChefItemModel[]) {
    this.data = data
  }

  nextDish(item: ChefItemModel, index: number) {
    if (item.currentIndexPage < item.dishes.length - 1) {
      item.pageView.setPage(item.currentIndexPage + 1)
      console.log("INDEX PAGE STATE", item.currentIndexPage)
      item.currentDishName = item.dishes[item.currentIndexPage + 1].title
      item.currentIndexPage++
      this.data[index] = item
    }
  }

  previousDish(item: ChefItemModel, index: number) {
    if (item.currentIndexPage > 0) {
      item.pageView.setPage(item.currentIndexPage - 1)
      console.log("INDEX PAGE STATE", item.currentIndexPage)
      item.currentDishName = item.dishes[item.currentIndexPage - 1].title
      item.currentIndexPage--
      this.data[index] = item
    }
  }

  chanageDish(item: ChefItemModel, position: number, index: number) {
    if (item.currentIndexPage !== position) {
      item.pageView.setPage(position)

      console.log("INDEX PAGE STATE", item.currentIndexPage)
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
      console.log("chefs useEffect")
      commonStore.setVisibleLoading(true)
      async function fetch() {
        // if (dishStore.dishesGroupedByChef.length > 0) return

        await dishStore.getGroupedByChef(dayStore.currentDay.date, RNLocalize.getTimeZone())
      }

      fetch().finally(() => {
        commonStore.setVisibleLoading(false)
        console.log("hide loaindg")
      })
    }, [])

    useEffect(() => {
      const formatData: ChefItemModel[] = dishStore.dishesGroupedByChef.map((chef: UserChef) => {
        return {
          ...chef,
          category: getCategoriesName(chef.categories),
          currentIndexPage: 0,
          pageView: null,
          currentDishName: chef.dishes.length > 0 ? chef.dishes[0]?.title : "",
        }
      })

      modalState.setData(formatData)
    }, [dishStore.dishesGroupedByChef])

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

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const toDishDetail = (dish: Dish, userChef: UserChef) => {
      const chef = {
        ...userChef,
      }
      navigation.push("dishDetail", { ...dish, chef })
    }

    const onChangeDay = async (day: Day) => {
      dayStore.setCurrentDay(day)
      await dishStore.getGroupedByChef(day.date, RNLocalize.getTimeZone())
    }

    return (
      <Screen
        preset="fixed"
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView style={styles.container}>
          <Location></Location>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => modalState.setVisibleWhy(state)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>
          <Separator style={utilSpacing.my4}></Separator>
          <Categories
            categories={categoryStore.categories}
            onPress={(category) => toCategory(category)}
          ></Categories>
          <Separator style={utilSpacing.my4}></Separator>
          <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
            <Text tx="chefs.delivery" preset="bold" size="lg"></Text>
            <Text text={` ${dayStore.currentDay.dayName}`} preset="bold" size="lg"></Text>
          </View>

          <View>
            {modalState.data.map((item, index) => (
              <ChefItem
                onDishPress={(dish) => toDishDetail(dish, item)}
                onPrevious={() => modalState.previousDish(item, index)}
                onNext={() => modalState.nextDish(item, index)}
                onChangePosition={(position) => modalState.chanageDish(item, position, index)}
                item={item}
                key={index}
              ></ChefItem>
            ))}
          </View>
        </ScrollView>
        <LocationModal></LocationModal>
        <DayDeliveryModal modal={modalState}></DayDeliveryModal>
        <Loader visible={commonStore.isVisibleLoading}></Loader>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },
})
