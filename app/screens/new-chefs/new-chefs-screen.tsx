import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { ScreenType, useChef } from "../../common/hooks/useChef"
import { Header, Screen } from "../../components"
import { useStores } from "../../models"
import { Dish } from "../../models/dish"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { utilSpacing } from "../../theme/Util"
import { ChefItemModel } from "../chefs/chef-item"
import { DataState, ListChef } from "../chefs/chef-list"

const state = new DataState()
export const NewChefsScreen: FC<StackScreenProps<NavigatorParamList, "newChefs">> = observer(
  function NewChefsScreen({ navigation }) {
    const { dayStore, dishStore, commonStore, messagesStore } = useStores()
    const { formatDishesGropuedByChef } = useChef()

    useEffect(() => {
      __DEV__ && console.log("new chefs useEffect")
      commonStore.setVisibleLoading(true)
      async function fetch() {
        await dishStore
          .getGroupedByLatestChef(dayStore.currentDay.date, RNLocalize.getTimeZone())
          .then(() => {
            state.setData(formatDishesGropuedByChef(dishStore.dishesGroupedByLatestChef))
          })
          .catch((error: Error) => {
            messagesStore.showError(error.message)
          })
          .finally(() => {
            commonStore.setVisibleLoading(false)
            __DEV__ && console.log("hide loaindg")
          })
      }

      fetch()
    }, [])

    const toScreen = (screen: ScreenType, dish: Dish, userChef: ChefItemModel) => {
      /**
       *it is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      console.log("toScreen", userChef)
      const chef = {
        ...userChef,
      }
      delete chef.category
      delete chef.currentDishName
      delete chef.pageView
      delete chef.currentIndexPage
      navigation.push(screen, { ...dish, chef: { ...chef }, isGetMenu: screen === "menuChef" })
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="newChefsScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView style={utilSpacing.p4}>
          <ListChef
            state={state}
            toScreen={(screen, dish, chef) => toScreen(screen, dish, chef)}
          ></ListChef>
        </ScrollView>
      </Screen>
    )
  },
)
