import React from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Chip } from "../chip/chip"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"
import i18n from "i18n-js"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Day } from "../../models/day-store"

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
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions

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
  const { style, hideWhyButton, titleTx, txOptions, onPress, onWhyPress, days = [] } = props

  const i18nText = titleTx && translate(titleTx, txOptions)

  const actualTitle = i18nText || "mainScreen.dayShipping"

  return (
    <View>
      <View style={[styles.flex, utilSpacing.mt6, styles.why]}>
        <Text tx={actualTitle} preset="semiBold" style={styles.dayShipping}></Text>
        {!hideWhyButton && <Chip tx="mainScreen.why" onPress={() => onWhyPress(true)}></Chip>}
      </View>
      <ScrollView horizontal style={[utilSpacing.mt5, utilSpacing.pb3, style]}>
        {days.map((day) => (
          <TouchableOpacity onPress={() => onPress(day)} key={day.date}>
            <Chip text={day.dayName} style={styles.chip}></Chip>
          </TouchableOpacity>
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
    marginBottom: spacing[2],
    marginRight: spacing[1],
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
