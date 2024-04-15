import { observer } from "mobx-react-lite"
import React from "react"
import { ScrollView } from "react-native"
import { useStores } from "../../models"
import { utilSpacing } from "../../theme/Util"
import { DishChef } from "../../components"
import { DishChef as DishChefModel } from "../../models/dish-store"

interface ListDishProps {
  onChangeDish: (dish: DishChefModel) => void
  dishId: number
  currencyCode: string
}

const ListDish = observer(({ onChangeDish, dishId, currencyCode }: ListDishProps) => {
  const { dishStore } = useStores()
  const filteredDishes = dishStore.dishesChef.filter((dish) => dishId !== dish.id)

  return (
    <ScrollView horizontal style={[utilSpacing.mb4, utilSpacing.ml5]}>
      {filteredDishes.map((dish) => (
        <DishChef
          onPress={() => onChangeDish(dish)}
          dish={dish}
          key={dish.id}
          currencyCode={currencyCode}
        ></DishChef>
      ))}
    </ScrollView>
  )
})

export default ListDish
