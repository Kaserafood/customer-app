import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React from "react"
import { View } from "react-native"
import { ScreenType } from "../../common/hooks/useChef"
import { Dish } from "../../models/dish"
import { ChefItem, ChefItemModel } from "./chef-item"
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

  chanageDish(item: ChefItemModel, position: number, index: number) {
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

export const ListChef = observer(function ListChef(props: {
  toScreen: (screen: ScreenType, dish: Dish, userChef: ChefItemModel) => void
  state: DataState
}) {
  const { state } = props
  return (
    <View>
      {state.data.map((chef, index) => (
        <View key={chef.id}>
          <ChefItem
            onChefPress={() => props.toScreen("menuChef", chef.dishes[0], chef)}
            onPrevious={() => state.previousDish(chef, index)}
            onNext={() => state.nextDish(chef, index)}
            onChangePosition={(position) => state.chanageDish(chef, position, index)}
            item={chef}
          ></ChefItem>
        </View>
      ))}
    </View>
  )
})
