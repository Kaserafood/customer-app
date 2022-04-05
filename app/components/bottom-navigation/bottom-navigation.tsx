import * as React from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Text } from "../text/text"
import { AutoImage } from ".."

import Images from "assets/images"

import { spacing } from "../../theme/spacing"

import Ripple from "react-native-material-ripple"

import { useStores } from "../../models"

interface ActiveIndex {
  getIndex: () => number
  setIndex: (number: number) => void
}

export interface BottomNavigationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Active index
   */
  activeIndex: ActiveIndex
}

/**
 * Bottom navigation for main screen
 */
export const BottomNavigation = observer(function BottomNavigation(props: BottomNavigationProps) {
  const { style, activeIndex } = props

  const { modalStore } = useStores()

  return (
    <>
      <View style={[style, styles.flex, styles.containerBottomNavigation]}>
        {modalStore.isVisibleModal && <View style={styles.disabled}></View>}

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(0)}>
            <AutoImage
              resizeMode="contain"
              style={styles.icon}
              source={activeIndex.getIndex() === 0 ? Images.homeActive : Images.home}
            ></AutoImage>
            <Text tx="bottomNavigation.home"></Text>
          </Ripple>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(1)}>
            <AutoImage
              resizeMode="contain"
              style={styles.icon}
              source={activeIndex.getIndex() === 1 ? Images.chefActive : Images.chef}
            ></AutoImage>
            <Text tx="bottomNavigation.chefs"></Text>
          </Ripple>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(2)}>
            <AutoImage
              resizeMode="contain"
              style={styles.icon}
              source={activeIndex.getIndex() === 2 ? Images.seachActive : Images.search}
            ></AutoImage>
            <Text tx="bottomNavigation.search"></Text>
          </Ripple>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(3)}>
            <AutoImage resizeMode="contain" style={styles.icon} source={Images.more}></AutoImage>
            <Text tx="bottomNavigation.more"></Text>
          </Ripple>
        </TouchableOpacity>
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  containerBottomNavigation: {
    elevation: 5,
    justifyContent: "space-between",

    shadowColor: color.palette.grayDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabled: {
    backgroundColor: color.palette.grayTransparent,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },

  icon: {
    height: 30,
    paddingTop: spacing[2],
    width: 30,
  },
  ripple: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    paddingTop: spacing[2],
    width: "100%",
  },
})
