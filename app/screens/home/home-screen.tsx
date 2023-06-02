import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

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
  Text,
} from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"
import { Banner as BannerModel } from "../../models/banner-store"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { DishChef, DishChef as DishModel } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { loadString, saveString } from "../../utils/storage"
import LottieView from "lottie-react-native"
import { Banner } from "./banner"
import { ModalWelcome } from "./modal-welcome"
import RNUxcam from "react-native-ux-cam"
import { DishParams } from "./dish.types"
import { async } from "validate.js"

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
    const [refreshing, setRefreshing] = useState(false)
    const [fetchData, setFetchData] = useState(true)
    const [isFetchingMoreData, setIsFetchingMoreData] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFirstTime, setIsFirstTime] = useState(true)
    const {
      dishStore,
      dayStore,
      commonStore,
      categoryStore,
      userStore,
      cartStore,
      messagesStore,
      deliveryStore,
      addressStore,
    } = useStores()
    const { currentDay } = dayStore

    useEffect(() => {
      if (addressStore.current?.latitude && addressStore.current?.longitude) {
        fetch(false, null)
      }
    }, [addressStore.current.id])

    const toCategory = (category: Category) => {
      RNUxcam.logEvent("categoryTap", {
        screen: "home",
        category: category.name,
        id: category.id,
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const onBannerPress = (banner: BannerModel) => {
      const category: Category = {
        id: banner.categoryId,
        name: banner.categoryName,
        image: "",
      }
      RNUxcam.logEvent("bannerTap", {
        category: category.name,
        id: category.id,
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const toDetail = (dish: DishModel) => {
      if (cartStore.hasItems) cartStore.cleanItems()
      /**
       *the chef id is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      dishStore.setIsUpdate(false)
      navigation.navigate("dishDetail", {
        ...dish,
        tempId: undefined,
        quantity: undefined,
        noteChef: undefined,
        timestamp: undefined,
      })
    }

    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
      RNUxcam.tagScreenName("Inicio")
    }, [])

    // useEffect(() => {
    //   if (!isFirstTime) {
    //     __DEV__ && console.log("Home  useEffect date", dayStore.currentDay.date)
    //     dishStore
    //       .getAll(dayStore.currentDay.date, RNLocalize.getTimeZone(), userStore.userId, null)
    //       .catch((error: Error) => {
    //         messagesStore.showError(error.message)
    //       })
    //       .finally(() => {
    //         if (isLoading) {
    //           commonStore.setVisibleLoading(false)
    //           setIsLoading(false)
    //         }
    //       })
    //   } else setIsFirstTime(false)
    // }, [dayStore.currentDay.date])

    const onChangeDay = async (day: Day) => {
      const { latitude, longitude } = addressStore.current
      const params: DishParams = {
        date: day.date,
        timeZone: RNLocalize.getTimeZone(),
        userId: userStore.userId,
        latitude: latitude,
        longitude: longitude,
        cleanCurrentDishes: true,
        categoryId: null,
        tokenPagination: null,
      }

      setIsLoading(true)
      setIsFirstTime(false)
      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      RNUxcam.logEvent("changeDate", {
        screen: "home",
      })
      await dishStore
        .getAll(params)
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
        })
    }

    useEffect(() => {
      __DEV__ && console.log("Home  useEffect")

      if (!userStore.addressId) {
        navigation.navigate("map", { screenToReturn: "main" })
      }

      async function setUserStoreData() {
        if (!userStore.userId) {
          const id = await loadString("userId")
          const displayName = await loadString("displayName")
          const addressId = await loadString("addressId")
          const email = await loadString("email")

          userStore.setUserId(Number(id))
          userStore.setDisplayName(displayName)
          userStore.setAddressId(Number(addressId))
          userStore.setEmail(email)
        }

        if (!userStore.countryId) {
          await saveString("countryId", "1")
          userStore.setCountryId(1)
        }
      }
      setUserStoreData()

      if (addressStore.current.id) fetch(false, null)
    }, [])

    const fetch = async (useCurrentDate: boolean, tokenPagination: string) => {
      commonStore.setVisibleLoading(true)
      /*
       * When is in development environment, not is nessesary clean items from cart because will be producess an error when is in the checkout screen and others screens
       */
      if (!__DEV__) if (cartStore.hasItems) cartStore.cleanItems()
      if (tokenPagination) setIsFetchingMoreData(true)
      const params: DishParams = {
        date: useCurrentDate ? dayStore.currentDay.date : null,
        timeZone: RNLocalize.getTimeZone(),
        userId: userStore.userId,
        latitude: addressStore.current.latitude,
        longitude: addressStore.current.longitude,
        cleanCurrentDishes: true,
        tokenPagination,
      }
      console.log("Fetch home data")
      await Promise.all([
        dishStore.getAll(params),
        categoryStore.getAll(),
        categoryStore.getSeasonal(),
        dayStore.getDays(RNLocalize.getTimeZone()),
      ])
        .then(() => {
          if (dayStore.days?.length > 0) {
            if (useCurrentDate) dayStore.setCurrentDay(dayStore.currentDay)
            else {
              setIsFirstTime(true)
              dayStore.setCurrentDay(dayStore.days[0])
            }
          }
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
        })
    }

    const onScroll = (event) => {
      if (isCloseToBottom(event.nativeEvent) && fetchData && dishStore.dishes.length > 0) {
        setFetchData(false)
        setIsFetchingMoreData(true)

        const params: DishParams = {
          date: dayStore.currentDay.date,
          timeZone: RNLocalize.getTimeZone(),
          userId: userStore.userId,
          latitude: addressStore.current.latitude,
          longitude: addressStore.current.longitude,
          cleanCurrentDishes: false,
          tokenPagination: dishStore.currentTokenPagination,
        }
        dishStore
          .getAll(params)
          .then((response) => {
            if (!response?.isEmptyResult) setFetchData(true)
          })
          .finally(() => {
            setIsFetchingMoreData(false)
          })
      }
    }

    const onRefresh = useCallback(async () => {
      setRefreshing(true)
      setFetchData(true)
      const existsDate = dayStore.currentDay?.date?.length > 0
      await fetch(existsDate, null).then(() => setRefreshing(false))
    }, [])

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
    }

    return (
      <Screen
        preset="fixed"
        style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={onScroll}
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
            {isFetchingMoreData && dishStore.dishes.length > 0 && (
              <LottieView
                style={styles.loadingDots}
                source={require("../../components/loader/loading-dots.json")}
                autoPlay
                loop
              />
            )}
          </View>
          <View style={utilSpacing.mb8}>
            {!commonStore.isVisibleLoading && !refreshing && (
              <EmptyData
                lengthData={dishStore.totalDishes}
                onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
              ></EmptyData>
            )}
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
  loadingDots: {
    alignSelf: "center",
    display: "flex",
    height: 30,
    width: "auto",
    zIndex: 10000,
  },
})
