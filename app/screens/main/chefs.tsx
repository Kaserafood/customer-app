import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Dimensions, StyleSheet, View } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { ScreenType, useChef } from "../../common/hooks/useChef"
import { Text } from "../../components/text/text"
import { useStores } from "../../models"
import { Dish } from "../../models/dish"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { ChefItem, ChefItemModel } from "../chefs/chef-item"

export class DataState {
  data: ChefItemModel[] = []

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

  changeDish(item: ChefItemModel, position: number, index: number) {
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

type chefScreenProp = StackNavigationProp<NavigatorParamList, "menuChef">

const Chefs = observer(function ListChef(props: { state: DataState }) {
  const { state } = props

  const {
    dishStore,
    commonStore,
    cartStore,
    addressStore,
    userStore,
    dayStore,
    messagesStore,
  } = useStores()
  const { formatDishesGroupedByChef } = useChef()

  const navigation = useNavigation<chefScreenProp>()

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
    navigation.navigate(screen as "menuChef", { ...chef, isGetMenu: screen === "menuChef" })
  }

  useEffect(() => {
    if (addressStore.current?.latitude && addressStore.current?.longitude) {
      // commonStore.setVisibleLoading(true)

      fetch()
    }
  }, [userStore.addressId, addressStore.current?.latitude, addressStore.current?.longitude, dayStore.currentDay.date])

  const fetch = () => {
    console.log("Fetching chefs")
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
      .finally(() => {
        commonStore.setVisibleLoading(false)
      })
  }

  return (
    <View style={utilSpacing.ml5}>
      <View style={[styles.containerTitle, utilSpacing.my5]}>
        <Text tx="mainScreen.someChefsForYou" preset="bold" size="lg"></Text>
        <View style={styles.bar}></View>
      </View>
      <ScrollView horizontal>
        {state.data.map((chef, index) => (
          <View key={chef.id} style={[styles.item, utilSpacing.mr5]}>
            <ChefItem
              onChefPress={() => toScreen("menuChef", chef.dishes[0], chef)}
              onPrevious={() => state.previousDish(chef, index)}
              onNext={() => state.nextDish(chef, index)}
              onChangePosition={(position) => state.changeDish(chef, position, index)}
              item={chef}
            ></ChefItem>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})
const windowWidth = Dimensions.get("window").width

const styles = StyleSheet.create({
  bar: {
    backgroundColor: color.primary,
    height: 2,
    left: 60,
    position: "relative",
    width: 40,
  },

  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },

  item: {
    width: windowWidth - 75,
  },
})

export default Chefs
