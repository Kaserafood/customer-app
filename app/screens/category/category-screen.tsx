import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { DayDelivery, Dish, Header, Loader, Screen, Separator, Text } from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { EmptyData } from "../../components/empty-data/empty-data"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { DishChef as DishModel } from "../../models/dish-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

class ModalState {
  isVisibleWhy = false

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const modalState = new ModalState()
export const CategoryScreen: FC<StackScreenProps<NavigatorParamList, "category">> = observer(
  ({ route: { params }, navigation }) => {
    const {
      dayStore,
      dishStore: { dishesCategory, getAll },
      commonStore: modalStore,
    } = useStores()

    useEffect(() => {
      console.log(params)
      async function fetch() {
        modalStore.setVisibleLoading(true)
        await getAll(dayStore.currentDay.date, RNLocalize.getTimeZone(), params.id)
      }

      fetch().finally(() => {
        modalStore.setVisibleLoading(false)
      })
    }, [])

    const onChangeDay = async (day: Day) => {
      modalStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await getAll(day.date, RNLocalize.getTimeZone(), params.id).finally(() => {
        modalStore.setVisibleLoading(false)
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
        <ScrollView style={styles.container}>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => modalState.setVisibleWhy(true)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>
          <Text tx="common.dishes" preset="bold" size="lg" style={utilSpacing.my3}></Text>
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

          <EmptyData lengthData={dishesCategory.length}></EmptyData>
        </ScrollView>
        <DayDeliveryModal modal={modalState}></DayDeliveryModal>
        <Loader></Loader>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  root: {
    backgroundColor: color.background,
  },
})
