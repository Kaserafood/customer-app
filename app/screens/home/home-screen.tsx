import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"

import LottieView from "lottie-react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import RNUxcam from "react-native-ux-cam"
import { ScreenType, useChef } from "../../common/hooks/useChef"
import {
  Categories,
  Chip,
  DayDelivery,
  Dish,
  EmptyData,
  Icon,
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
import { NavigatorParamList, goBack } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalStateHandler } from "../../utils/modalState"
import { loadString } from "../../utils/storage"
import { ChefItemModel } from "../chefs/chef-item"
import { Banner } from "./banner"
import { DataState, ListChef } from "./chef-list"
import { DishParams } from "./dish.types"
import { ModalWelcome } from "./modal-welcome"
import PopularDishes from "./popular-dishes"

const modalStateWhy = new ModalStateHandler()
const modalStateLocation = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
const modalDeliveryDate = new ModalStateHandler()
const modalStateWelcome = new ModalStateHandler()
const state = new DataState()
const mixpanel = getInstanceMixpanel()
/**
 * Home Screen to show main dishes
 */
export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "dishes">> = observer(
  ({ navigation, route: { params } }) => {
    const [refreshing, setRefreshing] = useState(false)
    const [fetchData, setFetchData] = useState(true)
    const [isFetchingMoreData, setIsFetchingMoreData] = useState(false)
    const { formatDishesGroupedByChef } = useChef()
    const {
      dishStore,
      dayStore,
      commonStore,
      categoryStore,
      userStore,
      cartStore,
      messagesStore,
      addressStore,
    } = useStores()
    const { currentDay } = dayStore
    const [isAtTop, setIsAtTop] = useState(true)

    useEffect(() => {
      if (addressStore.current?.latitude && addressStore.current?.longitude) {
        fetch(false, null)
      }
    }, [userStore.addressId, addressStore.current?.latitude, addressStore.current?.longitude])

    const toCategory = (category: Category) => {
      RNUxcam.logEvent("categoryTap", {
        screen: "home",
        category: category.name,
        id: category.id,
      })

      mixpanel.track("Category press", {
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

      mixpanel.track("Banner press", {
        screen: "home",
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

      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      RNUxcam.logEvent("changeDate", {
        screen: "home",
      })
      mixpanel.track("Change date", {
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
      }
      setUserStoreData()

      if (addressStore.current.id) fetch(false, null)
      mixpanel.track("Dishes Screen")
    }, [])

    const fetch = async (useCurrentDate: boolean, tokenPagination: string) => {
      commonStore.setVisibleLoading(true)
      /*
       * When is in environment development, not is necessary clean items in the cart because it produce an error  in checkout screen and others screens
       */
      if (!__DEV__) if (cartStore.hasItems) cartStore.cleanItems()
      if (tokenPagination) setIsFetchingMoreData(true)
      fetchChefs()
      const params: DishParams = {
        date: useCurrentDate ? dayStore.currentDay.date : null,
        timeZone: RNLocalize.getTimeZone(),
        userId: userStore.userId,
        latitude: addressStore.current.latitude,
        longitude: addressStore.current.longitude,
        cleanCurrentDishes: true,
        tokenPagination,
      }

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

    const fetchChefs = () => {
      const { latitude, longitude } = addressStore.current

      state.setData([])
      dishStore
        .getGroupedByChef(dayStore.currentDay.date, RNLocalize.getTimeZone(), latitude, longitude)
        .then(() => {
          // fake data =
          // const data = []

          // data.push(formatDishesGroupedByChef(dishStore.dishesGroupedByChef)[0])
          // data.push(formatDishesGroupedByChef(dishStore.dishesGroupedByChef)[0])
          // data.push(formatDishesGroupedByChef(dishStore.dishesGroupedByChef)[0])
          // data.push(formatDishesGroupedByChef(dishStore.dishesGroupedByChef)[0])
          state.setData(formatDishesGroupedByChef(dishStore.dishesGroupedByChef))
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
    }

    const onScroll = (event) => {
      const { contentOffset } = event.nativeEvent

      const isAtTop = contentOffset.y === 0

      setIsAtTop(isAtTop)

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

    const toScreen = (screen: ScreenType, userChef: ChefItemModel) => {
      /**
       *it is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */

      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      dishStore.setIsUpdate(false)

      if (cartStore.hasItems) cartStore.cleanItems()
      const chef = {
        ...userChef,
      }
      delete chef.category
      delete chef.currentDishName
      delete chef.pageView
      delete chef.currentIndexPage
      navigation.push(screen, { ...chef, isGetMenu: screen === "menuChef" })
    }

    const getChef = (index: number) => {
      const chef = state.data.slice(index, index + 1)

      const data = new DataState()
      data.setData(chef)

      return data
    }

    const handleSearch = () => {
      mixpanel.track("Search Dish Screen press")
      navigation.navigate("search")
    }

    return (
      <Screen
        preset="fixed"
        style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <View
          style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow, utilSpacing.px5]}
        >
          {params && params?.showBackIcon && (
            <TouchableOpacity
              style={[styles.btnBack, utilSpacing.ml5]}
              onPress={goBack}
              activeOpacity={0.5}
            >
              <Icon
                name="angle-left-1"
                style={utilSpacing.mr2}
                size={24}
                color={color.palette.white}
              ></Icon>
            </TouchableOpacity>
          )}
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
          ></Location>
        </View>

        <View style={[utilSpacing.px5, !isAtTop && styles.borderBottom]}>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            rippleContainerBorderRadius={150}
            style={[
              styles.search,
              utilSpacing.py4,
              utilSpacing.px4,
              utilSpacing.mb4,
              utilFlex.flexRow,
              styles.shadow,
              utilFlex.flexCenterVertical,
            ]}
            onPress={handleSearch}
          >
            <Icon name="search" type="Octicons" color={color.palette.black} size={18}></Icon>
            <Text tx="mainScreen.search" style={utilSpacing.ml3}></Text>
          </Ripple>
        </View>
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={onScroll}
        >
          <PopularDishes onPressDish={(dish) => toDetail(dish)}></PopularDishes>
          <Separator style={[utilSpacing.mx5, utilSpacing.mt3]}></Separator>
          <View style={utilSpacing.pl5}>
            <DayDelivery
              days={dayStore.days}
              onWhyPress={(state) => modalStateWhy.setVisible(state)}
              onPress={(day) => {
                onChangeDay(day)
              }}
            ></DayDelivery>
          </View>

          <Separator style={utilSpacing.m5}></Separator>
          <Categories
            categories={categoryStore.categories}
            onPress={(category) => toCategory(category)}
          ></Categories>
          <Separator style={utilSpacing.m4}></Separator>
          <Banner
            onPressNewChefs={() => navigation.navigate("newChefs")}
            onBannerPress={onBannerPress}
            onPressWelcome={() => modalStateWelcome.setVisible(true)}
          ></Banner>
          <View>
            <View
              style={[
                utilFlex.flexRow,
                utilSpacing.mt3,
                utilSpacing.mb6,
                utilSpacing.ml5,
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
                dishes={dishStore.dishes.slice(0, 3)}
                toDetail={(dish) => toDetail(dish)}
              ></ListDishes>
            )}
            {getChef(0)?.data?.length > 0 && (
              <ListChef
                state={getChef(0)}
                toScreen={(screen, dish, chef) => toScreen(screen, chef)}
              ></ListChef>
            )}
            {dishStore.dishes.slice(3, 5).length > 0 && (
              <ListDishes
                dishes={dishStore.dishes.slice(3, 5)}
                toDetail={(dish) => toDetail(dish)}
              ></ListDishes>
            )}
            {getChef(1)?.data?.length > 0 && (
              <ListChef
                state={getChef(1)}
                toScreen={(screen, dish, chef) => toScreen(screen, chef)}
              ></ListChef>
            )}
            {dishStore.dishes.slice(5, 8).length > 0 && (
              <ListDishes
                dishes={dishStore.dishes.slice(5, 8)}
                toDetail={(dish) => toDetail(dish)}
              ></ListDishes>
            )}
            {getChef(2)?.data?.length > 0 && (
              <ListChef
                state={getChef(2)}
                toScreen={(screen, dish, chef) => toScreen(screen, chef)}
              ></ListChef>
            )}
            {dishStore.dishes.slice(8, 500).length > 0 && (
              <ListDishes
                dishes={dishStore.dishes.slice(8, 500)}
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
  borderBottom: {
    borderBottomColor: palette.grayLight,
    borderBottomWidth: 1,
  },
  btnBack: {
    alignItems: "center",
    backgroundColor: color.primaryDarker,
    borderRadius: 100,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  btnSearch: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  chip: {
    borderRadius: spacing[3],
    marginRight: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  containerLocation: {
    // backgroundColor: color.primary,
    // ...SHADOW,
    // height: 63,
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
  search: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  shadow: {
    elevation: 5,
    shadowColor: color.palette.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,

    shadowRadius: 20,
  },
})
