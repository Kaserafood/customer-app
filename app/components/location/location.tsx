import Images from "assets/images"
import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import SvgUri from "react-native-svg-uri"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"

export interface LocationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Componet for location on the home and chef  components
 */
export const Location = observer(function Location(props: LocationProps) {
  const { style } = props
  const { modalStore } = useStores()
  return (
    <View style={[styles.containerAddress, style]}>
      <TouchableOpacity
        onPress={() => modalStore.setVisibleModalLocaton(true)}
        style={styles.btnAddress}
        activeOpacity={0.7}
      >
        <SvgUri width="24" height="24" source={Images.location} />
        <Text numberOfLines={1} style={styles.textAddress} tx="mainScreen.address"></Text>
        <SvgUri width="24" height="24" source={Images.caretDown} />
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  btnAddress: {
    backgroundColor: color.primary,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  containerAddress: {
    flex: 1,
  },

  textAddress: {
    bottom: -4,
    color: color.palette.white,
    flex: 1,
    marginLeft: spacing[2],
    position: "relative",
  },
})
