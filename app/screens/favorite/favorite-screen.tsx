import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { Dish, Header, Screen, Separator } from "../../components"
import { useStores } from "../../models"
import { DishChef } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { utilSpacing } from "../../theme/Util"

export const FavoriteScreen: FC<StackScreenProps<NavigatorParamList, "favorite">> = observer(
  function FavoriteScreen({ navigation }) {
    const { dishStore, cartStore, commonStore, dayStore } = useStores()

    useEffect(() => {
      async function fetch() {
        commonStore.setVisibleLoading(true)
        await dishStore
          .getFavorites(dayStore.currentDay.date, RNLocalize.getTimeZone())
          .finally(() => commonStore.setVisibleLoading(false))
      }
      fetch()
    }, [])

    const toDetail = (dish: DishChef) => {
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

    return (
      <Screen preset="fixed">
        <Header headerTx="favoriteScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <View style={utilSpacing.p4}>
            {dishStore.dishesFavorites.map((dish, index) => (
              <View key={dish.id}>
                <Dish dish={dish} onPress={() => toDetail(dish)}></Dish>
                {index !== dishStore.totalDishesFavorites - 1 && (
                  <Separator style={utilSpacing.my3}></Separator>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </Screen>
    )
  },
)
