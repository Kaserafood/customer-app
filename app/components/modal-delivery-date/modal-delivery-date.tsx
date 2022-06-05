import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import Ripple from "react-native-material-ripple"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Chip } from "../chip/chip"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"
interface ModalState {
  isVisible: boolean
  setVisible: (state: boolean) => void
}

class ModalWhyState {
  isVisibleWhy = false

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalWhyState()

export interface ModalDeliveryDateProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Mutable class for managing component visivility.
   */
  modal: ModalState
}

/**
 * Modal for display delivery dates avalibales for the order
 */
export const ModalDeliveryDate = observer(function ModalDeliveryDate(
  props: ModalDeliveryDateProps,
) {
  const { style, modal } = props
  const { dayStore, commonStore } = useStores()

  useEffect(() => {
    console.log("ModalDeliveryDate: useEffect")

    async function fetchData() {
      await dayStore.getDaysByChef(RNLocalize.getTimeZone(), commonStore.currentChefId)
      console.log(dayStore.daysByChef)
    }
    fetchData()
  }, [])

  return (
    <>
      <Modal modal={modal} style={style}>
        <View>
          <View style={utilFlex.flexRow}>
            <Text tx="modalDeliveryDate.deliveryDate" preset="bold" style={utilSpacing.mr4}></Text>
            <Chip
              tx="modalDeliveryDate.why"
              style={utilSpacing.pb2}
              onPressIn={() => modalState.setVisibleWhy(true)}
            ></Chip>
          </View>
          <ScrollView style={[utilSpacing.mt5, styles.body]}>
            <ListDay></ListDay>
          </ScrollView>
          <View style={[styles.containerButton, utilFlex.selfCenter]}>
            <Button
              onPress={() => modal.setVisible(false)}
              style={utilSpacing.mt5}
              block
              preset="primary"
              tx="common.continue"
            ></Button>
          </View>
        </View>
      </Modal>
      <DayDeliveryModal modal={modalState}></DayDeliveryModal>
    </>
  )
})
const ListDay = observer(() => {
  const { dayStore } = useStores()

  const onPress = (day: Day) => {
    dayStore.setActiveDay(day)

    dayStore.setCurrentDay(day)
  }
  return (
    <View>
      {dayStore.daysByChef.map((day) => (
        <Card style={[utilSpacing.mt4, utilSpacing.mx3, utilSpacing.p0]} key={day.date}>
          <Ripple style={[utilSpacing.px3, utilSpacing.py2]} onPress={() => onPress(day)}>
            <Checkbox rounded value={day.active} preset="tiny" text={day.dayName}></Checkbox>
          </Ripple>
        </Card>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  body: {
    maxHeight: 350,
  },
  containerButton: {
    width: "85%",
  },
})
