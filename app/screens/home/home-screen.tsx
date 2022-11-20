import * as RNLocalize from "react-native-localize"

import {
  Categories,
  Chip,
  DayDelivery,
  Dish,
  EmptyData,
  Location,
  ModalDeliveryDate,
  ModalRequestDish,
  Screen,
  Separator,
  Text
} from "../../components"
import { DishChef, DishChef as DishModel } from "../../models/dish-store"
import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

import { AppEventsLogger } from "react-native-fbsdk-next"
import { Banner } from "./banner"
import { Banner as BannerModel } from "../../models/banner-store"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { ModalLocation } from "../../components/location/modal-location"
import { ModalStateHandler } from "../../utils/modalState"
import { ModalWelcome } from "./modal-welcome"
import { NavigatorParamList } from "../../navigators"
import { StackScreenProps } from "@react-navigation/stack"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { loadString } from "../../utils/storage"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

const modalStateWhy = new ModalStateHandler()
const modalStateLocation = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
const modalDeliveryDate = new ModalStateHandler()
const modalStateWelcome = new ModalStateHandler()

/**
 * Home Screen to show main dishes
 */
export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const {
      dishStore,
      dayStore,
      commonStore,
      categoryStore,
      userStore,
      orderStore,
      cartStore,
      messagesStore,
    } = useStores()
    const { currentDay } = dayStore

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const onBannerPress = (banner: BannerModel) => {
      const category: Category = {
        id: banner.categoryId,
        name: banner.categoryName,
        image: ""
      }
      navigation.navigate("category", {
        ...category,
      })
    }

    const toDetail = (dish: DishModel) => {
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

    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await dishStore
        .getAll(day.date, RNLocalize.getTimeZone(), userStore.userId)
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
        })
    }

    useEffect(() => {
      __DEV__ && console.log("Home  useEffect")
      commonStore.setVisibleLoading(true)
      async function setUserStoreData() {
        if (!userStore.userId) {
          __DEV__ && console.log("Getting string user data")
          const id = await loadString("userId")
          const displayName = await loadString("displayName")
          const addressId = await loadString("addressId")
          const email = await loadString("email")

          userStore.setUserId(Number(id))
          userStore.setDisplayName(displayName)
          userStore.setAddressId(Number(addressId))
          userStore.setEmail(email)
        }
      }
      setUserStoreData()

      fetch()
    }, [])

    const fetch = async () => {

      /*
       * When is in develoment enviroment, not need clean items from cart because will be produccess an error when is in the screen delivery-detail-screen and others screens
       */
      if (!__DEV__) if (cartStore.hasItems) cartStore.cleanItems()

      await Promise.all([
        dishStore.getAll(null, RNLocalize.getTimeZone(), userStore.userId),
        categoryStore.getAll(),
        categoryStore.getSeasonal(),
        orderStore.getPriceDelivery(),
        dayStore.getDays(RNLocalize.getTimeZone()),
      ])
        .then(() => {
          if (dayStore.days?.length > 0) {
            dayStore.setCurrentDay(dayStore.days[0])
          }
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
          __DEV__ && console.log("hide loading")
        })

    }

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      console.log("NOEW IS REFRESHING")
      await fetch().then(() => setRefreshing(false));
    }, []);

    return (
      <Screen
        preset="fixed"
        style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
        >
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={utilSpacing.px4}
          ></Location>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => modalStateWhy.setVisible(state)}
            onPress={(day) => {
              onChangeDay(day)
            }}
          ></DayDelivery>

          <Separator style={utilSpacing.m4}></Separator>
          <Categories
            categories={categoryStore.categories}
            onPress={(category) => toCategory(category)}
          ></Categories>
          <Separator style={utilSpacing.m4}></Separator>
          <Banner
            onPressWelcome={() => modalStateWelcome.setVisible(true)}
            onPressNewChefs={() => navigation.navigate("newChefs")}
            onBannerPress={onBannerPress}

          ></Banner>
          <View style={utilSpacing.px4}>
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
                onPress={() => modalDeliveryDate.setVisible(true)}
                text={currentDay.dayName}
                style={[utilSpacing.ml3, styles.chip]}
              ></Chip>
            </View>
            {dishStore.dishes.length > 0 && (
              <ListDishes
                dishes={dishStore.dishes}
                toDetail={(dish) => toDetail(dish)}
              ></ListDishes>
            )}
          </View>
          <View style={utilSpacing.mb8}>
            {
              (!commonStore.isVisibleLoading && !refreshing) && (
                <EmptyData
                  lengthData={dishStore.totalDishes}
                  onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
                ></EmptyData>
              )
            }

          </View>
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <DayDeliveryModal modal={modalStateWhy}></DayDeliveryModal>
        <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
        <ModalDeliveryDate
          isAllGet
          modal={modalDeliveryDate}
          onSelectDay={(day) => onChangeDay(day)}
          isVisibleContinue={false}
        ></ModalDeliveryDate>
        <ModalWelcome modalState={modalStateWelcome}></ModalWelcome>
      </Screen>
    )
  },
)
const ListDishes = observer(function ListDishes(props: {
  toDetail: (dish: DishModel) => void
  dishes: DishChef[]
}) {
  const { dishStore } = useStores()

  const onPressDish = (dish: DishChef) => {
    props.toDetail(dish)

    AppEventsLogger.logEvent("HomeDishPress", {
      dishId: dish.id,
      dishName: dish.title,
      chefName: dish.chef.name,
      description: "El usuario seleccionó un plato en la pantalla principal (Home)",
    })
  }

  return (
    <View>
      {props.dishes.map((dish, index) => (
        <View key={dish.id}>
          <Dish dish={dish} onPress={() => onPressDish(dish)}></Dish>
          {index !== dishStore.totalDishes - 1 && <Separator style={utilSpacing.my3}></Separator>}
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  chip: {
    borderRadius: spacing[3],
    marginRight: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
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
