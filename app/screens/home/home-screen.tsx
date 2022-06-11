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
  ModalRequestDish,
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
import { ModalStateHandler } from "../../utils/modalState"
import { loadString } from "../../utils/storage"

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
const modalStateRequestDish = new ModalStateHandler()

/**
 * Home Screen to show main dishes
 */
export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation }) => {
    const { onChangeDay } = useDay()
    const { dishStore, dayStore, commonStore, categoryStore, userStore } = useStores()
    const { days, setCurrentDay, currentDay } = dayStore

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const toDetail = (dish: DishModel) => {
      /**
       *it is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
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
      async function setUserStoreData() {
        if (!userStore.userId) {
          console.log("Getting string user data")
          const id = await loadString("userId")
          const displayName = await loadString("displayName")
          const addressId = await loadString("addressId")

          userStore.setUserId(Number(id))
          userStore.setDisplayName(displayName)
          userStore.setAddressId(Number(addressId))
        }
      }
      setUserStoreData()

      fetch()
    }, [])

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
          </View>
          <View style={utilSpacing.mb8}>
            <EmptyData
              lengthData={dishStore.totalDishes}
              onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
            ></EmptyData>
          </View>
        </ScrollView>
        <LocationModal screenToReturn="main" modal={modalState}></LocationModal>
        <DayDeliveryModal modal={modalState}></DayDeliveryModal>
        <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
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
  iconShipping: {
    height: 24,
    marginLeft: spacing[4],
    width: 24,
  },
})
