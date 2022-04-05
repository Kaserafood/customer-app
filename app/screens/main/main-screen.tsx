import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { BottomNavigation, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { MainPager } from "../../components/main-pager/main-pager"
import { makeAutoObservable } from "mobx"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

class ActiveIndex {
  index = 0

  constructor() {
    makeAutoObservable(this)
  }

  setIndex(index: number) {
    this.index = index
  }

  getIndex() {
    return this.index
  }
}

const activeIndex = new ActiveIndex()
export const MainScreen: FC<StackScreenProps<NavigatorParamList, "main">> = observer(
  function MainScreen() {
    return (
      <Screen style={ROOT} preset="scroll">
        <MainPager activeIndex={activeIndex}></MainPager>
        <BottomNavigation activeIndex={activeIndex}></BottomNavigation>
      </Screen>
    )
  },
)
