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
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
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
  const { dayStore, dishStore, userStore, addressStore, cartStore, commonStore } = useStores()
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
        console.log("getting dat")
        if (data.kind === "ok") setData(data.data?.dishes as DishChef[])
      },
      onError: (error) => {
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
          <Text>
            <Text tx="mainScreen.book" preset="bold" size="lg"></Text>
            <Text
              tx="mainScreen.homemadeDishes"
              preset="bold"
              style={utilText.textPrimary}
              size="lg"
            ></Text>
            <Text tx="mainScreen.localChefs" preset="bold" size="lg"></Text>
          </Text>
        </View>

        <DayDelivery
          days={dayStore.days}
          onWhyPress={onWhyPress}
          onPress={handleChangeDay}
          style={utilSpacing.m0}
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
  const { dishStore, commonStore, cartStore } = useStores()

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
    left: -2,
    position: "relative",
    top: 2,
    width: 60,
  },
  button: {
    minWidth: 240,
  },
  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
})
export default Dishes
