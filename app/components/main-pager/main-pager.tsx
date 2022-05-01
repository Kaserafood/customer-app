import { observer } from "mobx-react-lite"
import * as React from "react"
import { useEffect } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import PagerView from "react-native-pager-view"
import { Chefs } from "../chefs/chefs"
import { Home } from "../home/home"
import { Search } from "../search/search"

interface ActiveIndex {
  getIndex: () => number
  setIndex: (number: number) => void
}

export interface MainPagerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Page index
   */
  activeIndex: ActiveIndex
}

/**
 * Describe your component here
 */
export const MainPager = observer((props: MainPagerProps) => {
  const { style, activeIndex } = props
  let pageView = null

  useEffect(() => {
    pageView.setPage(activeIndex.getIndex())
  }, [activeIndex.getIndex()])

  return (
    <>
      <PagerView
        ref={(c) => {
          pageView = c
        }}
        style={[style, styles.pagerView]}
        initialPage={activeIndex.getIndex()}
        scrollEnabled={false}
      >
        <View key={0}>
          <Home></Home>
        </View>
        <View key={1}>
          <Chefs></Chefs>
        </View>
        <View key={2}>
          <Search></Search>
        </View>
      </PagerView>
    </>
  )
})

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
})
