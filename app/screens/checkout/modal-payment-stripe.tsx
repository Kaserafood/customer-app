import React, { useRef, useState } from "react"

import { Modal, Text, Button } from "../../components"
import { ModalState } from "../../utils/modalState"
import { CardField, useStripe, initStripe } from "@stripe/stripe-react-native"
import { utilSpacing } from "../../theme/Util"

import { TextInput, View, StyleSheet, Keyboard } from "react-native"
import { useStores } from "../../models"
import { useEffectAsync } from "react-native-text-input-mask"
import { color } from "../../theme"
import { translate } from "../../i18n"

interface Props {
  stateModal: ModalState
  onGetCards: () => void
}

interface CardDetails {
  complete: boolean
}

export interface SetupIntent {
  email: string
  userId: number
  address: string
  customerName: string
}

export const ModalPaymentStripe = ({ stateModal, onGetCards }: Props) => {
  const { userStore, addressStore, messagesStore, countryStore, commonStore } = useStores()
  const cardFieldRef = useRef(null)
  const [nameCard, setNameCard] = useState(null)
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    complete: false,
  })

  const { createPaymentMethod, confirmSetupIntent } = useStripe()

  useEffectAsync(async () => {
    const publishableKey = await userStore.getPublishableKey()
    await initStripe({
      publishableKey,
    })
  }, [])

  const handleSubmit = async () => {
    if (!nameCard || nameCard.trim().length === 0) {
      messagesStore.showError("paymentCard.nameRequired", true)
      return
    }

    if (!cardDetails.complete) {
      messagesStore.showError("paymentCard.cardInvalid", true)
      return
    }

    const dataIntent: SetupIntent = {
      email: userStore.email,
      userId: userStore.userId,
      address: addressStore.current.address,
      customerName: userStore.displayName,
    }

    Keyboard.dismiss()
    commonStore.setVisibleLoading(true)
    const clientSecret = await userStore.addSetupIntent(dataIntent)

    if (!clientSecret) {
      messagesStore.showError("common.someError", true)
      commonStore.setVisibleLoading(false)
      __DEV__ && console.log("Can't create setup intent")
      return
    }

    const { error: e, paymentMethod } = await createPaymentMethod({
      paymentMethodType: "Card",
      paymentMethodData: {
        billingDetails: {
          name: nameCard,
        },
      },
    })

    if (e) {
      messagesStore.showError("common.someError", true)
      commonStore.setVisibleLoading(false)
      __DEV__ && console.log("Setup intent confirmation error", e)
      return
    } else if (!paymentMethod) {
      messagesStore.showError("common.someError", true)
      commonStore.setVisibleLoading(false)
      __DEV__ && console.log("Setup intent confirmation error", e.message)
      return
    }

    const { error, setupIntent: setupIntentResult } = await confirmSetupIntent(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        paymentMethodId: paymentMethod.id,
      },
    })

    if (error) {
      messagesStore.showError("common.someError", true)

      __DEV__ && console.log("Setup intent confirmation error", error.message)
    } else if (setupIntentResult) {
      messagesStore.showSuccess("paymentCard.paymentAdded", true)
      stateModal.setVisible(false)

      onGetCards()
    }
    commonStore.setVisibleLoading(false)
  }

  return (
    <Modal isFullScreen state={stateModal} position="bottom" styleBody={utilSpacing.p6}>
      <View>
        <Text
          preset="bold"
          size="xl"
          tx="checkoutScreen.paymentCard"
          style={[utilSpacing.mb2, utilSpacing.mt5]}
        ></Text>

        <TextInput
          autoFocus
          placeholder={translate("paymentCard.name")}
          placeholderTextColor={color.palette.grayPlaceHolder}
          style={styles.input}
          onChangeText={(text) => setNameCard(text)}
          value={nameCard}
        ></TextInput>

        <CardField
          ref={cardFieldRef}
          countryCode={countryStore.selectedCountry.code.toLocaleLowerCase()}
          postalCodeEnabled={false}
          style={styles.fieldStyle}
          cardStyle={styles.cardStyle}
          onCardChange={setCardDetails}
          placeholders={{
            expiration: translate("paymentCard.expirationDatePlaceholder"),
          }}
        />

        <Button tx="common.save" block onPress={handleSubmit}></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: 10,
    placeholderColor: color.palette.grayPlaceHolder,
    textColor: color.text,
  },

  fieldStyle: {
    height: 48,
    marginVertical: 30,
    width: "100%",
  },
  input: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: 10,
    color: color.text,
    fontSize: 18,
    marginTop: 32,
    paddingHorizontal: 24,
  },
})
