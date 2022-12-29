import React, { useEffect, useState } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import Ripple from "react-native-material-ripple"
import { observer } from "mobx-react-lite"

import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState, ModalStateHandler } from "../../utils/modalState"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Chip } from "../chip/chip"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"

const modalState = new ModalStateHandler()

export interface ModalDeliveryDateProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Mutable class for managing component visivility.
   */
  modal: ModalState

  /**
   * If get all days
   */
  isAllGet?: boolean

  /**
   *
   * Callback on select day
   */
  onSelectDay?: (day: Day) => void

  /**
   * If the button continue is visible
   */
  isVisibleContinue?: boolean
}

/**
 * Modal for display delivery dates avalibales for the order
 */
export const ModalDeliveryDate = function ModalDeliveryDate(props: ModalDeliveryDateProps) {
  const { style, modal, isAllGet, onSelectDay, isVisibleContinue = true } = props
  const { dayStore, commonStore } = useStores()

  useEffect(() => {
    __DEV__ && console.log("ModalDeliveryDate: useEffect")

    async function fetchData() {
      await dayStore.getDaysByChef(RNLocalize.getTimeZone(), commonStore.currentChefId)
    }
    fetchData()
  }, [])

  return (
    <>
      <Modal modal={modal} style={style} position="bottom">
        <View>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Text
              tx="modalDeliveryDate.deliveryDate"
              preset="bold"
              style={[utilSpacing.mr4, utilSpacing.ml3]}
            ></Text>
            <Chip
              tx="modalDeliveryDate.why"
              style={utilSpacing.py2}
              onPressIn={() => modalState.setVisible(true)}
            ></Chip>
          </View>
          <ScrollView style={[utilSpacing.mt5, styles.body]}>
            <ListDay
              isGetAll={isAllGet}
              modalState={modal}
              onSelectDay={(day) => onSelectDay && onSelectDay(day)}
            ></ListDay>
          </ScrollView>
          {isVisibleContinue && (
            <View style={[styles.containerButton, utilFlex.selfCenter]}>
              <Button
                onPress={() => modal.setVisible(false)}
                style={utilSpacing.mt5}
                block
                preset="primary"
                tx="common.continue"
              ></Button>
            </View>
          )}
        </View>
      </Modal>
      <DayDeliveryModal modal={modalState}></DayDeliveryModal>
    </>
  )
}
const ListDay = observer(
  (props: { isGetAll: boolean; modalState: ModalState; onSelectDay?: (day: Day) => void }) => {
    const { dayStore } = useStores()
    const [days, setDays] = useState([])
    const { isGetAll, modalState, onSelectDay } = props

    useEffect(() => {
      if (isGetAll) setDays(dayStore.days)
      else setDays(dayStore.daysByChef)
    }, [])

    const onPress = (day: Day) => {
      onSelectDay(day)
      dayStore.setActiveDay(day)
      dayStore.setCurrentDay(day)
      modalState.setVisible(false)
    }

    return (
      <View>
        {days.map((day, index) => (
          <Card
            style={[
              utilSpacing.mb4,
              utilSpacing.mx3,
              utilSpacing.p0,
              index === 0 && utilSpacing.mt3,
            ]}
            key={day.date}
          >
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={[utilSpacing.px3, utilSpacing.py2]}
              onPress={() => onPress(day)}
            >
              <Checkbox
                rounded
                value={day.date === dayStore.currentDay.date}
                preset="medium"
                text={day.dayNameLong}
              ></Checkbox>
            </Ripple>
          </Card>
        ))}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    maxHeight: 350,
  },
  containerButton: {
    width: "85%",
  },
})
