import React from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { Button, Image, Modal, Separator, Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

import { ModalPaymentCard } from "./modal-payment-card"

interface ModalPaymentListProps {
  stateModal: ModalStateHandler
}
const modalStatePaymentCard = new ModalStateHandler()
type paymentType = "card" | "cash"
type typeCard = "visa" | "mastercard" | "american"
export const ModalPaymentList = observer(({ stateModal }: ModalPaymentListProps) => {
  const getImageByTypeCard = (type: typeCard) => {
    switch (type) {
      case "visa":
        return images.cardVisa
      case "mastercard":
        return images.cardMastercard
      case "american":
        return images.cardAmex
      default:
        return images.cardVisa
    }
  }

  const getImageByType = (type: paymentType, subType: typeCard) => {
    switch (type) {
      case "card":
        return getImageByTypeCard(subType)
      case "cash":
        return images.cash
      default:
        return images.cash
    }
  }

  const data = [
    {
      id: 1,
      name: "Tarjeta de crédito",
      number: "**** 1234",
      type: "card",
      typeCard: "visa",
    },
    {
      id: 2,
      name: "Tarjeta de crédito",
      number: "**** 1234",
      type: "cash",
    },
    {
      id: 3,
      name: "Tarjeta de crédito",
      number: "**** 1234",
      type: "card",
      typeCard: "mastercard",
    },
    {
      id: 5,
      name: "Tarjeta de crédito",
      number: "**** 1234",
      type: "card",
      typeCard: "american",
    },
  ]
  return (
    <>
      <Modal modal={stateModal} isFullScreen styleBody={utilSpacing.p5}>
        <View>
          <Text
            size="xl"
            tx="checkoutScreen.paymentMethod"
            style={[utilSpacing.pb4, utilSpacing.mt4]}
            preset="bold"
          ></Text>
          <ScrollView>
            {data.map((item, index) => (
              <View key={item.id}>
                <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.py4]}>
                  <Image
                    style={[styles.imageCard, utilSpacing.mr4]}
                    source={getImageByType(item.type as paymentType, item.typeCard as typeCard)}
                  ></Image>
                  <Text text={item.name} style={utilFlex.flex1}></Text>

                  {index === 0 ? (
                    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                      <IconRN name="check" size={30} color={color.palette.black} />
                    </Animated.View>
                  ) : (
                    <View style={styles.h30}></View>
                  )}
                </View>

                {index !== data.length - 1 && <Separator></Separator>}
              </View>
            ))}
          </ScrollView>
          <Button
            preset="white"
            tx="checkoutScreen.addPayment"
            style={[utilSpacing.mt4, utilFlex.selfCenter]}
            onPress={() => modalStatePaymentCard.setVisible(true)}
          ></Button>
        </View>
        <ModalPaymentCard
          modalState={modalStatePaymentCard}
          onSubmit={() => console.log("bmbir")}
        ></ModalPaymentCard>
      </Modal>
    </>
  )
})

const styles = StyleSheet.create({
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
