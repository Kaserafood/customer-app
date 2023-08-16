import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"

import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"

export interface LocationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Callback on click location
   */
  onPress?: () => void
}

/**
 * Component for location on the home and chef screen
 */
export const Location = observer(function Location(props: LocationProps) {
  const { style, onPress } = props
  const { addressStore } = useStores()

  return (
    <View style={[styles.containerAddress, style]}>
      <TouchableOpacity onPressIn={() => onPress()} style={styles.btnAddress} activeOpacity={0.7}>
        <Icon name="location-dot" size={24} color={color.primary} />
        <Text
          numberOfLines={1}
          style={styles.textAddress}
          text={addressStore.current.address}
        ></Text>
        <Icon name="angle-down" size={24} color={color.primary} />
      </TouchableOpacity>
    </View>
  )
})

const styles = StyleSheet.create({
  btnAddress: {
    backgroundColor: color.palette.white,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignItems: "center",
  },

  containerAddress: {
    flex: 1,
  },

  textAddress: {
    color: color.text,
    flex: 1,
    marginBottom: 0,
    marginLeft: spacing[2],
    marginRight: spacing[2],
    position: "relative",
    top: 2,
  },
})
