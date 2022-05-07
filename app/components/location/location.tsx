import { observer } from "mobx-react-lite"
import React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import IconRN from "react-native-vector-icons/FontAwesome"
import { Icon, Text } from ".."
import { useStores } from "../../models"
import { color, spacing } from "../../theme"

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
        <Icon name="location-1" size={24} color={color.palette.white} />
        <Text numberOfLines={1} style={styles.textAddress} tx="mainScreen.address"></Text>
        <IconRN name="caret-down" size={24} color={color.palette.white} />
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
    alignItems: "center",
  },

  containerAddress: {
    flex: 1,
  },

  textAddress: {
    color: color.palette.white,
    flex: 1,
    marginBottom: 0,
    marginLeft: spacing[2],
    marginRight: spacing[2],
    position: "relative",
  },
})
