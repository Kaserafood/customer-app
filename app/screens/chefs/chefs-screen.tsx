import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { useChef } from "../../common/hooks/useChef"
import {
  Categories,
  Chip,
  DayDelivery,
  Location,
  ModalDeliveryDate,
  Screen,
  Separator,
  Text,
} from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { Dish } from "../../models/dish"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

import { ChefItemModel } from "./chef-item"
import { DataState, ListChef } from "./chef-list"

const modalStateLocation = new ModalStateHandler()
const modalStateDay = new ModalStateHandler()
const modalDeliveryDate = new ModalStateHandler()
type ScreenType = "dishDetail" | "menuChef"
const state = new DataState()
/**
 * Chef screen for show all chefs with dishes
 */
export const ChefsScreen: FC<StackScreenProps<NavigatorParamList, "chefs">> = observer(
  function ChefsScreen({ navigation }) {
    const {
      categoryStore,
      dayStore,
      dishStore,
      commonStore,
      cartStore,
      messagesStore,
    } = useStores()
    const { formatDishesGropuedByChef } = useChef()
    const [refreshing, setRefreshing] = useState(false)

    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    useEffect(() => {
      __DEV__ && console.log("chefs useEffect")
      commonStore.setVisibleLoading(true)

      fetch()
    }, [])

    const fetch = async () => {
      state.setData([])
      await dishStore
        .getGroupedByChef(dayStore.currentDay.date, RNLocalize.getTimeZone())
        .then(() => {
          state.setData(formatDishesGropuedByChef(dishStore.dishesGroupedByChef))
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
          __DEV__ && console.log("hide loaindg")
        })
    }

    const toCategory = (category: Category) => {
      navigation.navigate("category", {
        ...category,
      })
    }

    const toScreen = (screen: ScreenType, dish: Dish, userChef: ChefItemModel) => {
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

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      state.setData([])
      dayStore.setCurrentDay(day)
      await dishStore
        .getGroupedByChef(day.date, RNLocalize.getTimeZone())
        .then(() => {
          if (dishStore.dishesGroupedByChef.length > 0) {
            state.setData(formatDishesGropuedByChef(dishStore.dishesGroupedByChef))
            __DEV__ && console.log("formatData changed")
          }
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }

    const onRefresh = async () => {
      setRefreshing(true)
      await fetch().finally(() => setRefreshing(false))
    }

    return (
      <Screen
        preset="fixed"
        statusBar="dark-content"
        style={styles.container}
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={utilSpacing.px4}
          ></Location>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => modalStateDay.setVisible(state)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>

          <Separator style={utilSpacing.m4}></Separator>
          <Categories
            categories={categoryStore.categories}
            onPress={(category) => toCategory(category)}
          ></Categories>
          <View style={utilSpacing.px4}>
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
                onPress={() => modalDeliveryDate.setVisible(true)}
                text={dayStore.currentDay.dayName}
                style={[utilSpacing.ml3, styles.chip]}
              ></Chip>
            </View>

            {state.data.length > 0 && (
              <ListChef
                state={state}
                toScreen={(screen, dish, chef) => toScreen(screen, dish, chef)}
              ></ListChef>
            )}
          </View>
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <DayDeliveryModal modal={modalStateDay}></DayDeliveryModal>
        <ModalDeliveryDate
          isAllGet
          modal={modalDeliveryDate}
          onSelectDay={(day) => onChangeDay(day)}
        ></ModalDeliveryDate>
      </Screen>
    )
  },
)

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
})
