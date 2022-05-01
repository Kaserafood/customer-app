import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ViewStyle } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { BottomNavigation, Loader, Screen } from "../../components"
import { MainPager } from "../../components/main-pager/main-pager"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex } from "../../theme/Util"

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
    useEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    return (
      <Screen
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
        style={ROOT}
        preset="scroll"
        bottomBarBackgroundColor={color.palette.white}
      >
        <GestureHandlerRootView style={utilFlex.flex1}>
          <MainPager activeIndex={activeIndex}></MainPager>
        </GestureHandlerRootView>

        <BottomNavigation activeIndex={activeIndex}></BottomNavigation>
        <Loader visible></Loader>
      </Screen>
    )
  },
)
