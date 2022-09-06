import { observer } from "mobx-react-lite"
import React from "react"
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Chip } from "../chip/chip"
import { Text } from "../text/text"

export interface DayDeliveryProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Hide the why? button
   */
  hideWhyButton?: boolean

  /**
   * Title showing top of the chips
   */
  titleTx?: TxKeyPath

  /**
   * Function to set the date selected
   */

  onPress: (day: Day) => void

  /**
   * Days
   */
  days: Day[]

  /**
   * Function for onPress button why?
   */
  onWhyPress?: (state: boolean) => void
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDelivery = observer(function DayDelivery(props: DayDeliveryProps) {
  const { style, hideWhyButton, titleTx, onPress, onWhyPress, days = [] } = props

  const { dayStore } = useStores()

  return (
    <View>
      <View style={[utilFlex.flexCenterVertical, utilSpacing.mt6, styles.why]}>
        <Text
          tx={titleTx || "mainScreen.dayShipping"}
          preset="semiBold"
          style={[styles.dayShipping, utilSpacing.ml4]}
        ></Text>
        {!hideWhyButton && (
          <Chip tx="mainScreen.why" style={styles.chip} onPressIn={() => onWhyPress(true)}></Chip>
        )}
      </View>
      <ScrollView horizontal style={[utilSpacing.pt5, utilSpacing.pb3, style]}>
        {days.map((day, index) => (
          <Chip
            active={day.date === dayStore.currentDay.date}
            text={day.dayName}
            style={[styles.chip, utilSpacing.my2, index === 0 && utilSpacing.ml4]}
            onPress={() => {
              onPress(day)
              dayStore.setCurrentDay(day)
            }}
            key={day.date}
            activeOpacity={0.5}
            disabled={day.date === dayStore.currentDay.date}
          ></Chip>
        ))}
      </ScrollView>
    </View>
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
    borderRadius: spacing[3],
    marginRight: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
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
    borderRadius: spacing[3],
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
