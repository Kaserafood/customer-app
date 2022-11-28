import React from "react"
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { observer } from "mobx-react-lite"

import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"

import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

import { Chip } from "../chip/chip"
import { Day } from "../../models/day-store"
import React from "react"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { Text } from "../text/text"
import { TxKeyPath } from "../../i18n"
import { observer } from "mobx-react-lite"
import { useStores } from "../../models"

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

  /**
   *
   * Visible loading when data is not loaded
   */
  visibleLoading?: boolean
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDelivery = observer(function DayDelivery(props: DayDeliveryProps) {
  const {
    style,
    hideWhyButton,
    titleTx,
    onPress,
    onWhyPress,
    days = [],
    visibleLoading = false,
  } = props

  const { dayStore } = useStores()

  return (
    <View style={[utilSpacing.mt6, style]}>
      <View style={[utilFlex.flexCenterVertical, styles.why]}>
        <Text
          tx={titleTx || "mainScreen.dayShipping"}
          preset="semiBold"
          style={[styles.dayShipping, utilSpacing.ml4]}
        ></Text>
        {!hideWhyButton && (
          <Chip tx="mainScreen.why" style={styles.chip} onPressIn={() => onWhyPress(true)}></Chip>
        )}
      </View>
      <ScrollView horizontal style={[utilSpacing.pt5, utilSpacing.pb3]}>
        {days.length === 0 && visibleLoading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item flexDirection="row">
              <SkeletonPlaceholder.Item
                width={65}
                marginTop={4}
                height={25}
                marginLeft={12}
                borderRadius={16}
              />
              <SkeletonPlaceholder.Item
                width={65}
                marginTop={4}
                height={25}
                marginLeft={12}
                borderRadius={16}
              />
              <SkeletonPlaceholder.Item
                width={65}
                marginTop={4}
                height={25}
                marginLeft={12}
                borderRadius={16}
              />

              <SkeletonPlaceholder.Item
                width={65}
                marginTop={4}
                height={25}
                marginLeft={12}
                borderRadius={16}
              />
              <SkeletonPlaceholder.Item
                width={65}
                marginTop={4}
                height={25}
                marginLeft={12}
                borderRadius={16}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          days.map((day, index) => (
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
          ))
        )}
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
