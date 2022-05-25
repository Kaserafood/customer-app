import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
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
          <View style={utilSpacing.mt5}>
            <Card style={utilSpacing.mb4}>
              <Checkbox rounded value={true} preset="tiny" text="Mañana  12 de abril"></Checkbox>
            </Card>

            <Card style={utilSpacing.mb4}>
              <Checkbox rounded value={true} preset="tiny" text="Miercols  12 de abril"></Checkbox>
            </Card>
            <Card style={utilSpacing.mb4}>
              <Checkbox rounded value={true} preset="tiny" text="Jueves  12 de abril"></Checkbox>
            </Card>
            <Card style={utilSpacing.mb4}>
              <Checkbox rounded value={true} preset="tiny" text="Viernes  12 de abril"></Checkbox>
            </Card>
            <Card style={utilSpacing.mb4}>
              <Checkbox rounded value={true} preset="tiny" text="Sabado  12 de abril"></Checkbox>
            </Card>
          </View>
          <View style={[styles.containerButton, utilFlex.selfCenter]}>
            <Button style={utilSpacing.mt5} block preset="primary" tx="common.continue"></Button>
          </View>
        </View>
      </Modal>
      <DayDeliveryModal modal={modalState}></DayDeliveryModal>
    </>
  )
})

const styles = StyleSheet.create({
  containerButton: {
    width: "85%",
  },
})
