import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import * as RNLocalize from "react-native-localize"
import { useQuery } from "react-query"
import { Button, DayDelivery, Dish, Separator, Text } from "../../components"
import { useStores } from "../../models"
import { DishChef, DishChef as DishModel } from "../../models/dish-store"
import { Api } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

interface Props {
  onWhyPress: (state: boolean) => void
  onDishPress: (dish: DishChef) => void
}

interface DishResponse {
  data: { dishes: DishChef[]; token: string }
  kind: string
}

const Dishes = observer(({ onWhyPress, onDishPress }: Props) => {
  const navigation = useNavigation()
  const { dayStore, userStore, addressStore, messagesStore } = useStores()
  const [data, setData] = useState([])
  const api = new Api()

  useQuery(
    ["dishes-main", dayStore?.currentDay?.date || null, addressStore.current.latitude],
    () =>
      api.getAllDishes(
        dayStore?.currentDay?.date || null,
        RNLocalize.getTimeZone(),
        userStore.userId,
        null,
        addressStore.current.latitude,
        addressStore.current.longitude,
        null,
      ),
    {
      onSuccess: (data: DishResponse) => {
        if (data.kind === "ok") setData(data.data?.dishes as DishChef[])
      },
      onError: (error) => {
        messagesStore.showError()
        console.log(error)
      },
    },
  )

  const handleChangeDay = (day) => {
    console.log(day)
  }

  return (
    <View style={[utilSpacing.py5, utilSpacing.mt5]}>
      <View style={utilSpacing.pl5}>
        <View style={[styles.containerTitle, utilFlex.flexRow]}>
          <Text tx="mainScreen.book" preset="bold" size="lg"></Text>

          <View style={utilSpacing.ml2}>
            <Text tx="mainScreen.homemadeDishes" preset="bold" size="lg"></Text>
            <View style={styles.bar}></View>
          </View>
        </View>

        <DayDelivery
          days={dayStore.days}
          onWhyPress={onWhyPress}
          onPress={handleChangeDay}
          style={[utilSpacing.m0, utilSpacing.mb5]}
        ></DayDelivery>
      </View>

      {data.length > 0 && <ListDishes dishes={data} toDetail={onDishPress}></ListDishes>}

      <Button
        tx="mainScreen.seeMoreDishes"
        style={[styles.button, utilFlex.selfCenter, utilSpacing.mt4, utilSpacing.py4]}
        onPress={() => {
          navigation.navigate(getI18nText("tabMainNavigation.dishes") as never)
        }}
      ></Button>
    </View>
  )
})

const ListDishes = observer(function ListDishes(props: {
  toDetail: (dish: DishModel) => void
  dishes: DishChef[]
}) {
  const { dishStore } = useStores()

  const onPressDish = (dish: DishChef) => {
    props.toDetail(dish)

    // TODO: Add event for UXCAM
  }

  return (
    <View>
      {props.dishes.slice(0, 3).map((dish, index) => (
        <View key={dish.id}>
          <Dish dish={dish} onPress={() => onPressDish(dish)}></Dish>
          {index !== dishStore.totalDishes - 1 && <Separator style={utilSpacing.my3}></Separator>}
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  bar: {
    backgroundColor: color.primary,
    height: 2,

    position: "relative",
    top: 4,
    width: 56,
  },
  button: {
    minWidth: 260,
  },
  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
})
export default Dishes
