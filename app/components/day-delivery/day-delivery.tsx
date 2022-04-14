import React, { useState, useEffect } from "react"
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Chip } from "../chip/chip"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"
import { useStores } from "../../models"
import i18n from "i18n-js"
import { ScrollView } from "react-native-gesture-handler"

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
}

/**
 * Component for delivery days on the home and chef components
 */
export const DayDelivery = observer(function DayDelivery(props: DayDeliveryProps) {
  const { style, hideWhyButton, titleTx, txOptions } = props
  const { modalStore, dayStore } = useStores()
  const { days } = dayStore

  const i18nText = titleTx && translate(titleTx, txOptions)

  const actualTitle = i18nText || "mainScreen.dayShipping"

  useEffect(() => {
    async function fetchData() {
      await dayStore.getDays("2022-04-14T13:51:00")
    }
    fetchData()
  }, [])

  return (
    <View>
      <View style={[styles.flex, utilSpacing.mt6, styles.why]}>
        <Text tx={actualTitle} preset="semiBold" style={styles.dayShipping}></Text>
        {!hideWhyButton && (
          <Chip
            tx="mainScreen.why"
            onPress={() => modalStore.setVisibleModalDayDelivery(true)}
            active={modalStore.isVisibleModalDayDelivery}
          ></Chip>
        )}
      </View>
      <ScrollView horizontal style={[utilSpacing.mt5, utilSpacing.pb3, style]}>
        {days.map((day) => (
          <Chip text={day.dayName} key={day.date} style={styles.chip}></Chip>
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
