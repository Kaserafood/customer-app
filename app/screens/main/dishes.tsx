import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, DayDelivery, Dish, Separator, Text } from "../../components"
import { useStores } from "../../models"
import { DishChef, DishChef as DishModel } from "../../models/dish-store"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface Props {
  onWhyPress: (state: boolean) => void
}

const Dishes = ({ onWhyPress }: Props) => {
  const { dayStore, dishStore } = useStores()

  const handleChangeDay = (day) => {
    console.log(day)
  }

  const toDetail = (dish: DishChef) => {
    console.log(dish)
  }

  return (
    <View style={[utilSpacing.py5, utilSpacing.mt5]}>
      <View style={utilSpacing.pl5}>
        <View style={styles.containerTitle}>
          <Text tx="mainScreen.homemadeDishes" preset="bold" size="lg"></Text>
          <View style={styles.bar}></View>
        </View>

        <DayDelivery
          days={dayStore.days}
          onWhyPress={onWhyPress}
          onPress={handleChangeDay}
          style={utilSpacing.m0}
        ></DayDelivery>
      </View>

      {dishStore.dishes.length > 0 && (
        <ListDishes dishes={dishStore.dishes} toDetail={(dish) => toDetail(dish)}></ListDishes>
      )}

      <Button
        tx="mainScreen.seeMoreDishes"
        style={[styles.button, utilFlex.selfCenter, utilSpacing.mt4, utilSpacing.py4]}
      ></Button>
    </View>
  )
}

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
    left: 115,
    position: "relative",
    width: 65,
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
