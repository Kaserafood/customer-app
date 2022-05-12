import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { useDay } from "../../common/hooks/useDay"
import {
  Categories,
  DayDelivery,
  Dish,
  EmptyData,
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
import { DishChef as DishModel } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

class ModalState {
  isVisibleWhy = false
  isVisibleLocation = false

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  setVisibleLocation(state: boolean) {
    this.isVisibleLocation = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalState()

/**
 * Home Screen to show main dishes
 */
export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  function HomeScreen({ navigation }) {
    const { onChangeDay } = useDay()
    const { dishStore, dayStore, commonStore, categoryStore } = useStores()
    const { days, setCurrentDay, currentDay } = dayStore

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const toDetail = (dish: DishModel) => {
      navigation.navigate("dishDetail", {
        ...dish,
      })
    }

    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    useEffect(() => {
      console.log("Home  useEffect")
      async function fetch() {
        commonStore.setVisibleLoading(true)
        await dayStore.getDays(RNLocalize.getTimeZone())
        await Promise.all([
          dishStore.getAll(days[0].date, RNLocalize.getTimeZone()),
          categoryStore.getAll(),
        ])
          .then(() => setCurrentDay(days[0]))
          .finally(() => {
            commonStore.setVisibleLoading(false)
            console.log("hide loaindg")
          })
      }
      fetch()
    }, [categoryStore, commonStore, dayStore, days, dishStore, setCurrentDay])

    return (
      <Screen
        preset="scroll"
        style={styles.container}
        statusBar="dark-content"
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
            onPress={(day) => {
              console.log("clcik day", day)
              onChangeDay(day)
            }}
          ></DayDelivery>
          <View style={utilSpacing.px4}>
            <Separator style={utilSpacing.my4}></Separator>
            <Categories
              categories={categoryStore.categories}
              onPress={(category) => toCategory(category)}
            ></Categories>
            <Separator style={utilSpacing.my4}></Separator>
            <View style={[utilFlex.flexRow, utilSpacing.my3]}>
              <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
              <Text
                size="lg"
                style={utilSpacing.ml3}
                preset="bold"
                text={currentDay.dayName}
              ></Text>
            </View>
            <Separator style={utilSpacing.my4}></Separator>
            <ListDishes toDetail={(dish) => toDetail(dish)}></ListDishes>
            <View style={utilSpacing.mb8}>
              <EmptyData lengthData={dishStore.totalDishes}></EmptyData>
            </View>
          </View>
        </ScrollView>
        <LocationModal modal={modalState}></LocationModal>
        <DayDeliveryModal modal={modalState}></DayDeliveryModal>
        <Loader></Loader>
      </Screen>
    )
  },
)
const ListDishes = observer(function ListDishes(props: { toDetail: (dish: DishModel) => void }) {
  const { dishStore } = useStores()

  return (
    <View>
      {dishStore.dishes.map((dish, index) => (
        <View key={dish.id}>
          <Dish dish={dish} onPress={() => props.toDetail(dish)}></Dish>
          {index !== dishStore.totalDishes - 1 && <Separator style={utilSpacing.my3}></Separator>}
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

  flex1: {
    flex: 1,
  },
  iconShipping: {
    height: 24,
    marginLeft: spacing[4],
    width: 24,
  },
})
