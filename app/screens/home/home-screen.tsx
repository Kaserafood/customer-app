import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
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
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { DishChef, DishChef as DishModel } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { loadString } from "../../utils/storage"
import { Banner } from "./banner"
import { ModalWelcome } from "./modal-welcome"

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
    // const [dishes, setDishes] = useState<DishChef[]>([])
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
    const { days, setCurrentDay, currentDay } = dayStore

    const toCategory = (category: Category) => {
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

      async function fetch() {
        commonStore.setVisibleLoading(true)
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
            setCurrentDay(days[0])
          })
          .catch((error: Error) => {
            messagesStore.showError(error.message)
          })
          .finally(() => {
            commonStore.setVisibleLoading(false)
            __DEV__ && console.log("hide loading")
          })
      }
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

    return (
      <Screen
        preset="fixed"
        style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView nestedScrollEnabled style={styles.container}>
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
            onPressSeasonal={() => toCategory(categoryStore.seasonal)}
            onPressNewChefs={() => navigation.navigate("newChefs")}
            onPressFavorites={() => navigation.navigate("favorite")}
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
            <EmptyData
              lengthData={dishStore.totalDishes}
              onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
            ></EmptyData>
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

  return (
    <View>
      {props.dishes.map((dish, index) => (
        <View key={dish.id}>
          <Dish dish={dish} onPress={() => props.toDetail(dish)}></Dish>
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
