import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { AutoImage } from ".."
import { utilSpacing } from "../../theme/Util"
import Images from "assets/images"

export interface BottomNavigationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Bottom navigation for main screen
 */
export const BottomNavigation = observer(function BottomNavigation(props: BottomNavigationProps) {
  const { style } = props

  return (
    <View style={[style, styles.flex, styles.containerBottomNavigation]}>
      <TouchableOpacity style={utilSpacing.p3}>
        <AutoImage resizeMode="contain" style={styles.icon} source={Images.home}></AutoImage>
        <Text tx="mainScreen.home" style={utilSpacing.mt3}></Text>
      </TouchableOpacity>
      <TouchableOpacity style={utilSpacing.p3}>
        <AutoImage resizeMode="contain" style={styles.icon} source={Images.chef}></AutoImage>
        <Text tx="mainScreen.chef" style={utilSpacing.mt3}></Text>
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  containerBottomNavigation: {
    justifyContent: "space-around",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  icon: {
    height: 30,
    width: 30,
  },
})
