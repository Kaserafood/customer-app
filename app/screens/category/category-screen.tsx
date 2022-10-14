import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import {
  DayDelivery,
  Dish,
  Header,
  ModalRequestDish,
  Screen,
  Separator,
  Text,
} from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { EmptyData } from "../../components/empty-data/empty-data"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { DishChef as DishModel } from "../../models/dish-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

const modalStateWhy = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
export const CategoryScreen: FC<StackScreenProps<NavigatorParamList, "category">> = observer(
  ({ route: { params }, navigation }) => {
    const {
      dayStore,
      dishStore: { dishesCategory, getAll },
      commonStore,
      userStore,
      messagesStore,
    } = useStores()

    useEffect(() => {
      console.log(params)
      async function fetch() {
        commonStore.setVisibleLoading(true)
        await getAll(
          dayStore.currentDay.date,
          RNLocalize.getTimeZone(),
          userStore.userId,
          params.id,
        )
          .catch((error) => {
            messagesStore.showError(error.message)
          })
          .finally(() => {
            commonStore.setVisibleLoading(false)
          })
      }

      fetch()
    }, [])

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await getAll(day.date, RNLocalize.getTimeZone(), userStore.userId, params.id).finally(() => {
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
          ></DayDelivery>
          <View style={styles.container}>
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
          </View>

          <EmptyData
            lengthData={dishesCategory.length}
            onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
          ></EmptyData>
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
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  root: {
    backgroundColor: color.background,
  },
})
