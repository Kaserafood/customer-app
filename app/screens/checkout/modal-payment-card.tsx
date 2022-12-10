import React, { forwardRef, MutableRefObject, useImperativeHandle } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, View } from "react-native"
import { observer } from "mobx-react-lite"

import { Button, Modal, PaymentCard, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"

interface PropsModalPaymentCard {
  modalState: ModalState
  onSubmit: (values: Card) => void
}

export interface Card {
  name: string
  number: string
  cvv: string
  expirationDate: string
}

export const ModalPaymentCard = forwardRef(
  (props: PropsModalPaymentCard, ref: MutableRefObject<any>) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const { modalState } = props

    useImperativeHandle(ref, () => ({
      cleanInputs: () => {
        methods.reset()
      },
    }))

    const onSubmit = async (data: Card) => {
      Keyboard.dismiss()
      props.onSubmit(data)
      modalState.setVisible(false)
    }

    const onError: SubmitErrorHandler<any> = (errors) => {
      __DEV__ && console.log({ errors })
    }

    return (
      <>
        <Modal modal={modalState} position="bottom">
          <View>
            <Text
              preset="bold"
              size="lg"
              tx="checkoutScreen.paymentCard"
              style={[utilSpacing.mb2, utilSpacing.ml4]}
            ></Text>

            <FormProvider {...methods}>
              <PaymentCard methods={methods}></PaymentCard>
            </FormProvider>

            <View style={[utilFlex.flexRow, utilSpacing.mx4, utilSpacing.mt5]}>
              <Button
                tx="common.cancel"
                preset="white"
                style={[utilFlex.flex1, utilSpacing.mr2]}
                onPress={() => modalState.setVisible(false)}
              ></Button>

              <Button
                tx="common.ok"
                style={[utilFlex.flex1, utilSpacing.ml2]}
                onPress={methods.handleSubmit(onSubmit, onError)}
              ></Button>
            </View>
          </View>
        </Modal>
      </>
    )
  },
)
