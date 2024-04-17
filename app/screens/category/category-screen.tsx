import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"

import RNUxcam from "react-native-ux-cam"
import { DayDelivery, Dish, Header, ModalRequestDish, Screen, Separator } from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { EmptyData } from "../../components/empty-data/empty-data"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { DishChef as DishModel } from "../../models/dish-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalStateHandler } from "../../utils/modalState"
import { DishParams } from "../home/dish.types"

const modalStateWhy = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()

export const CategoryScreen: FC<StackScreenProps<NavigatorParamList, "category">> = observer(
  ({ route: { params }, navigation }) => {
    const [fetched, setFetched] = useState(false)
    const {
      dayStore,
      dishStore: { dishesCategory, getAll },
      commonStore,
      userStore,
      messagesStore,
      categoryStore,
      addressStore,
    } = useStores()

    useEffect(() => {
      async function fetch() {
        commonStore.setVisibleLoading(true)

        if (!params.name) {
          RNUxcam.tagScreenName("category")
          categoryStore.getAll().then(() => {
            navigation.setParams({
              name: categoryStore.categories.find((c) => c.id === Number(params.id))?.name,
            })
          })
        }

        const { latitude, longitude } = addressStore.current

        const paramsDish: DishParams = {
          date: dayStore.currentDay.date,
          timeZone: RNLocalize.getTimeZone(),
          userId: userStore.userId,
          latitude: latitude,
          longitude: longitude,
          cleanCurrentDishes: true,
          categoryId: params.id,
          tokenPagination: null,
        }

        await getAll(paramsDish)
          .catch((error) => {
            __DEV__ && console.log(error)
            messagesStore.showError()
          })
          .finally(() => {
            commonStore.setVisibleLoading(false)
            setFetched(true)
          })
      }
      mixpanel.track("Category Screen")
      fetch()
    }, [])

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)

      const { latitude, longitude } = addressStore.current

      const paramsDish: DishParams = {
        date: day.date,
        timeZone: RNLocalize.getTimeZone(),
        userId: userStore.userId,
        latitude: latitude,
        longitude: longitude,
        cleanCurrentDishes: true,
        categoryId: params.id,
        tokenPagination: null,
      }

      await getAll(paramsDish).finally(() => {
        commonStore.setVisibleLoading(false)
      })
    }

    const toDetail = (dish: DishModel) => {
      navigation.navigate("dishDetail", {
        ...dish,
      })
    }

    return (
      <Screen preset="fixed" style={styles.root}>
        <Header headerText={params.name} leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={() => modalStateWhy.setVisible(true)}
            onPress={(day) => onChangeDay(day)}
            style={utilSpacing.pl5}
          ></DayDelivery>
          <View style={styles.container}>
            <View style={utilSpacing.mb8}>
              {dishesCategory.map((dish, index) => (
                <View key={dish.id}>
                  <Dish dish={dish} onPress={() => toDetail(dish)}></Dish>

                  {index !== dishesCategory.length - 1 && (
                    <Separator style={utilSpacing.my3}></Separator>
                  )}
                </View>
              ))}
            </View>
          </View>

          {fetched && (
            <EmptyData
              lengthData={dishesCategory.length}
              onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
            ></EmptyData>
          )}
        </ScrollView>
        <DayDeliveryModal modal={modalStateWhy}></DayDeliveryModal>
        <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  root: {
    backgroundColor: color.background,
  },
})
