import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"

import { Button, Image, Modal, Separator, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getImageByType, paymentType, typeCard } from "../../utils/image"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"

import { ModalPaymentCard } from "./modal-payment-card"

interface ModalPaymentListProps {
  stateModal: ModalStateHandler
}
const modalStatePaymentCard = new ModalStateHandler()

export const ModalPaymentList = observer(({ stateModal }: ModalPaymentListProps) => {
  const { userStore, messagesStore } = useStores()
  useEffect(() => {
    ;(async () => {
      await fetch()
    })()
  }, [])

  const fetch = async () => {
    await userStore
      .getCads(userStore.userId)
      .then(() => {
        const existsSelected = userStore.cards.find((item) => item.selected)

        if (!existsSelected) {
          userStore.setCurrentCard(null)
        } else {
          if (existsSelected.id !== userStore.currentCard?.id) {
            userStore.setCurrentCard(existsSelected)
          }
        }
      })
      .catch((error: Error) => {
        messagesStore.showError(error.message)
      })
  }

  const onSelectedPaymentItem = (id: number | null) => {
    userStore
      .updateSelectedCard(userStore.userId, id)
      .then(async (res) => {
        if (res) {
          messagesStore.showSuccess("checkoutScreen.paymentMethodUpdated", true)
          await fetch()
          if (id) {
            userStore.setCurrentCard(userStore.cards.find((item) => item.id === id))
          } else {
            userStore.setCurrentCard(null)
          }
        } else {
          messagesStore.showError("checkoutScreen.paymentMethodNotUpdated", true)
        }
      })
      .catch((error: Error) => {
        console.log("error", error)
        messagesStore.showError(error.message)
      })
  }

  return (
    <>
      <Modal modal={stateModal} isFullScreen styleBody={utilSpacing.p5}>
        <View>
          <Text
            size="xl"
            tx="checkoutScreen.paymentMethods"
            style={[utilSpacing.pb4, utilSpacing.mt4]}
            preset="bold"
          ></Text>
          <ScrollView>
            <PaymentMethodItem
              id={0}
              name={getI18nText("checkoutScreen.paymentCash")}
              type="cash"
              selected={userStore.isNotSelectedCards}
              onSelected={() => onSelectedPaymentItem(null)}
              description={getI18nText("checkoutScreen.paymentCashDescription")}
            ></PaymentMethodItem>
            {userStore.cards.length > 0 && <Separator></Separator>}
            {userStore.cards.map((item, index) => (
              <View key={item.id}>
                <PaymentMethodItem
                  id={item.id}
                  name={item.name}
                  type="card"
                  subtType={item.type as typeCard}
                  selected={item.selected}
                  onSelected={() => onSelectedPaymentItem(item.id)}
                  description={item.number}
                  showPrefixCard
                ></PaymentMethodItem>
                {index !== userStore.cards.length - 1 && <Separator></Separator>}
              </View>
            ))}
          </ScrollView>
          <Button
            preset="white"
            tx="checkoutScreen.addPayment"
            style={[styles.btn, utilSpacing.mt4, utilFlex.selfCenter]}
            onPress={() => modalStatePaymentCard.setVisible(true)}
          ></Button>
        </View>
        <ModalPaymentCard
          modalState={modalStatePaymentCard}
          onGetCards={() => fetch()}
        ></ModalPaymentCard>
      </Modal>
    </>
  )
})

interface PaymentMethodItemProps {
  onSelected?: () => void
  id: number
  name: string
  description: string
  type: paymentType
  selected: boolean
  showPrefixCard?: boolean
  subtType?: typeCard
}

const PaymentMethodItem = ({
  onSelected,
  id,
  name,
  description,
  type,
  selected,
  showPrefixCard,
  subtType,
}: PaymentMethodItemProps) => {
  return (
    <Ripple key={id} onPress={onSelected}>
      <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.py4]}>
        <Image
          style={[styles.imageCard, utilSpacing.mr4]}
          source={getImageByType(type as paymentType, subtType)}
        ></Image>
        <View style={utilFlex.flex1}>
          <Text text={name} preset="semiBold" style={utilSpacing.pb1}></Text>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            {showPrefixCard && (
              <Text text="****" caption size="sm" style={[utilSpacing.mt2, utilSpacing.mr2]}></Text>
            )}
            <Text text={description} caption size="sm"></Text>
          </View>
        </View>

        {selected ? (
          <Animated.View entering={ZoomIn} exiting={ZoomOut}>
            <IconRN name="check" size={30} color={color.palette.black} />
          </Animated.View>
        ) : (
          <View style={styles.h30}></View>
        )}
      </View>
    </Ripple>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 210,
  },
  h30: {
    height: 30,
  },
  imageCard: {
    borderRadius: spacing[1],
    height: 24,
    marginLeft: spacing[1],
    width: 35,
  },
})
