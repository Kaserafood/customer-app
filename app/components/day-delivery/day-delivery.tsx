import React from "react"
import { StyleProp, View, ViewStyle, ScrollView, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Chip } from "../chip/chip"

import { Text } from "../text/text"
import { useStores } from "../../models"

export interface DayDeliveryProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDelivery = observer(function DayDelivery(props: DayDeliveryProps) {
  const { style } = props
  const { modalStore } = useStores()

  return (
    <>
      <View style={[styles.flex, utilSpacing.mt6, styles.why]}>
        <Text tx="mainScreen.dayShipping" preset="semiBold" style={styles.dayShipping}></Text>
        <Chip
          tx="mainScreen.why"
          onPress={() => modalStore.setVisibleModalDayDelivery(true)}
          active={modalStore.isVisibleModalDayDelivery}
        ></Chip>
      </View>
      <ScrollView horizontal style={[styles.flex, utilSpacing.mt5, utilSpacing.pb3, style]}>
        <Chip tx="mainScreen.tomorrow" style={styles.chip}></Chip>
        <Chip active text="Jue. May 16" style={utilSpacing.mr3}></Chip>
        <Chip text="Vier. May 17" style={utilSpacing.mr3}></Chip>
        <Chip text="Sab. May 18" style={utilSpacing.mr3}></Chip>
        <Chip text="Dom. May 19" style={utilSpacing.mr3}></Chip>
      </ScrollView>
    </>
  )
})

const styles = StyleSheet.create({
  bodyModal: {
    backgroundColor: color.palette.white,
    borderRadius: 20,
    padding: spacing[3],
    width: "90%",
  },
  chip: {
    marginBottom: spacing[2],
    marginRight: spacing[2],
  },
  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  containerImgModalWhy: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  containerModal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  dayShipping: {
    marginRight: spacing[2],
  },

  flex: {
    display: "flex",
    flexDirection: "row",
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  imgModalWhy: {
    height: 150,
    width: 150,
  },

  why: {
    alignItems: "center",
  },
})
