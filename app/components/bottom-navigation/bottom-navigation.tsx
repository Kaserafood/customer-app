import Images from "assets/images"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import { createIconSetFromIcoMoon } from "react-native-vector-icons"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { AutoImage } from "../auto-image/auto-image"
import { Text } from "../text/text"
import icoMoonConfig from "./selection.json"

const Icon = createIconSetFromIcoMoon(icoMoonConfig)

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

  return (
    <>
      <View style={[style, styles.flex, styles.containerBottomNavigation]}>
        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(0)}>
            <Icon
              name="home"
              size={35}
              color={activeIndex.getIndex() === 0 ? color.primary : color.text}
            />

            <Text tx="bottomNavigation.search"></Text>
          </Ripple>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(1)}>
            <Icon
              name="hat-chef"
              size={35}
              color={activeIndex.getIndex() === 1 ? color.primary : color.text}
            />

            <Text tx="bottomNavigation.search"></Text>
          </Ripple>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ripple style={styles.ripple} rippleCentered onPress={() => activeIndex.setIndex(2)}>
            <Icon
              name="search"
              size={35}
              color={activeIndex.getIndex() === 2 ? color.primary : color.text}
            />
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
