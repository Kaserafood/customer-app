import React, { forwardRef, MutableRefObject, useImperativeHandle } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, View } from "react-native"

import { Button, Modal, PaymentCard, Text } from "../../components"
import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getCardType } from "../../utils/card"
import { ModalState } from "../../utils/modalState"

interface PropsModalPaymentCard {
  modalState: ModalState
  onGetCards: () => void
}

export interface Card {
  name: string
  number: string
  cvv: string
  type: string
  expirationDate: string
  address: string
  city: string
  state: string
  country: string
}

export const ModalPaymentCard = forwardRef(
  (props: PropsModalPaymentCard, ref: MutableRefObject<any>) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const { modalState, onGetCards } = props
    const { userStore, messagesStore, addressStore, commonStore } = useStores()

    useImperativeHandle(ref, () => ({
      cleanInputs: () => {
        methods.reset()
      },
    }))

    const isCardDataValid = (card) => {
      if (
        !card ||
        !card.cvv ||
        !card.expirationDate ||
        !card.number ||
        !card.name ||
        card.cvv.trim().length === 0 ||
        card.expirationDate.trim().length === 0 ||
        card.number.trim().length === 0 ||
        card.name.trim().length === 0
      )
        return false

      return true
    }

    const onSubmit = async (data: any) => {
      if (!isCardDataValid(data)) {
        messagesStore.showError("checkoutScreen.paymentMethodErrorEmptyFields", true)
        return
      }

      // QPayPro does not support AMEX cards for tokenization
      if (getCardType(data.number) === "unknown" || getCardType(data.number) === "amex") {
        messagesStore.showError("checkoutScreen.paymentMethodErrorUnknown", true)
        return
      }

      Keyboard.dismiss()
      commonStore.setVisibleLoading(true)
      const model: Card = {
        ...data,
        type: getCardType(data.number).toLocaleLowerCase(),
        address: addressStore.current.address,
        city: addressStore.current.city,
        state: addressStore.current.region,
        country: addressStore.current.country,
      }
      __DEV__ && console.log({ model })
      await userStore
        .addCard(userStore.userId, model)
        .then(async (res) => {
          if (res) {
            modalState.setVisible(false)
            messagesStore.showSuccess("checkoutScreen.paymentMethodAdded", true)
            methods.reset()
            onGetCards()
          } else {
            messagesStore.showError("checkoutScreen.paymentMethodError", true)
          }
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
        })
    }

    const onError: SubmitErrorHandler<any> = (errors) => {
      __DEV__ && console.log({ errors })
    }

    return (
      <>
        <Modal modal={modalState} position="bottom">
          <ScrollView>
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
                tx="common.save"
                style={[utilFlex.flex1, utilSpacing.ml2]}
                onPress={methods.handleSubmit(onSubmit, onError)}
              ></Button>
            </View>
          </ScrollView>
        </Modal>
      </>
    )
  },
)
