import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import Ripple from "react-native-material-ripple"
import {
  Card,
  Checkbox,
  Header,
  InputText,
  ModalDeliveryDate,
  PaymentCard,
  Price,
  Screen,
  Separator,
  Text,
} from "../../components"
import { LocationModal } from "../../components/location/location-modal"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"

class ModalState {
  isVisibleLocation = false

  setVisibleLocation(state: boolean) {
    this.isVisibleLocation = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

class ModalDelivery {
  isVisible = false

  setVisible(state: boolean) {
    this.isVisible = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const modalState = new ModalState()
const modalDelivery = new ModalDelivery()

export const DeliveryDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "deliveryDetail">
> = observer(({ navigation }) => {
  const toEndOrder = () => navigation.navigate("endOrder")

  const { ...methods } = useForm({ mode: "onBlur" })
  const { addressStore, dayStore, cartStore } = useStores()
  const [labelDeliveryTime, setLabelDeliveryTime] = useState("")

  useEffect(() => {
    console.log("DeliveryDetailScreen : useEffect")
  }, [])

  return (
    <Screen style={styles.container} preset="fixed">
      <Header headerTx="deliveryDetailScreen.title" leftIcon="back" onLeftPress={goBack} />
      <ScrollView style={styles.containerForm}>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.info"
          style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
        ></Text>
        <FormProvider {...methods}>
          <TouchableOpacity activeOpacity={1} onPress={() => modalState.setVisibleLocation(true)}>
            <InputText
              name="address"
              preset="card"
              labelTx="deliveryDetailScreen.address"
              placeholderTx="deliveryDetailScreen.addressPlaceholder"
              editable={false}
              value={`${addressStore.current.name} - ${addressStore.current.address}`}
            ></InputText>
          </TouchableOpacity>

          <InputText
            name="deliveryNote"
            preset="card"
            labelTx="deliveryDetailScreen.deliveryNote"
            placeholderTx="deliveryDetailScreen.deliveryNotePlaceholder"
          ></InputText>
          <Separator style={[utilSpacing.mt3, utilSpacing.mb5, utilSpacing.mx4]}></Separator>

          <TouchableOpacity activeOpacity={1} onPress={() => modalDelivery.setVisible(true)}>
            <InputText
              name="diveryDate"
              preset="card"
              labelTx="deliveryDetailScreen.deliveryDate"
              placeholderTx="deliveryDetailScreen.deliveryDatePlaceholder"
              editable={false}
            ></InputText>
          </TouchableOpacity>
        </FormProvider>

        <Text
          preset="bold"
          style={[utilSpacing.mx4, utilSpacing.mb4, utilSpacing.mt5]}
          tx="deliveryDetailScreen.deliveryTime"
        ></Text>
        <DeliveryTimeList onSelectItem={(value) => setLabelDeliveryTime(value)}></DeliveryTimeList>
        <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.paymentMethod"
          style={[utilSpacing.mb4, utilSpacing.mx4]}
        ></Text>
        <PaymentCard></PaymentCard>
        <View style={utilSpacing.mx4}>
          <Separator style={utilSpacing.my6}></Separator>
          <Text preset="semiBold" tx="deliveryDetailScreen.delivery"></Text>
          <Text
            preset="semiBold"
            caption
            text={`${dayStore.currentDay.dayName} ${labelDeliveryTime}`}
            style={utilSpacing.mb6}
          ></Text>
          {/* Resume order */}
          <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
            <DishesList></DishesList>
            <Separator style={styles.separator}></Separator>
            <Totals></Totals>
          </Card>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={toEndOrder}
        activeOpacity={0.7}
        style={[styles.addToOrder, utilFlex.flexCenter]}
      >
        <View style={[utilSpacing.py3, utilFlex.flexRow]}>
          <Text
            preset="bold"
            style={[styles.textAddToOrder, utilSpacing.mx1]}
            tx="dishDetailScreen.pay"
          ></Text>
          <Price
            amount={cartStore.subtotal + 20}
            textStyle={[utilText.bold, styles.textAddToOrder]}
            style={styles.price}
          ></Price>
        </View>
      </TouchableOpacity>
      <LocationModal modal={modalState}></LocationModal>
      <ModalDeliveryDate modal={modalDelivery}></ModalDeliveryDate>
    </Screen>
  )
})

const DeliveryTimeList = (props: { onSelectItem: (item: string) => void }) => {
  const [data, setData] = useState([])
  useEffect(() => {
    setData([
      {
        label: "12pm a 3pm",
        value: false,
      },
      {
        label: "4am a 6pm",
        value: false,
      },
      {
        label: "6pm a 8pm",
        value: false,
      },
    ])
  }, [])

  const changeValue = (value, index) => {
    let newData = [...data]
    newData = newData.map((item) => {
      item.value = false
      return item
    })
    newData[index].value = value
    setData(newData)
    props.onSelectItem(newData[index].label)
    console.log(value)
  }
  return (
    <View>
      {data.map((item, index) => (
        <Card style={[utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]} key={index}>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            onPress={() => changeValue(!item.value, index)}
            style={utilSpacing.p2}
          >
            <Checkbox
              rounded
              style={utilSpacing.px3}
              value={item.value}
              preset="tiny"
              text={item.label}
            ></Checkbox>
          </Ripple>
        </Card>
      ))}
    </View>
  )
}

const DishesList = () => {
  const { cartStore } = useStores()
  return (
    <View>
      {cartStore.cart.map((item) => (
        <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={item.dish.id}>
          <View style={utilSpacing.mr3}>
            <Text text={`X ${item.quantity}`} numberOfLines={1} preset="semiBold"></Text>
          </View>
          <View style={utilFlex.flex1}>
            <Text preset="bold" numberOfLines={1} text={item.dish.title}></Text>
            <Text
              size="sm"
              numberOfLines={1}
              text={item.dish.description}
              caption
              style={utilText.textGray}
            ></Text>
          </View>
          <View style={utilSpacing.ml3}>
            <Price style={styles.price} amount={item.total}></Price>
          </View>
        </View>
      ))}
    </View>
  )
}

const Totals = () => {
  const { cartStore } = useStores()
  return (
    <View>
      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.subtotal"></Text>
        <Price style={styles.price} amount={cartStore.subtotal}></Price>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.deliveryAmount"></Text>
        <Price style={styles.price} amount={20}></Price>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
        <Price
          style={styles.price}
          textStyle={utilText.bold}
          amount={cartStore.subtotal + 20}
        ></Price>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerForm: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "90%",
  },
  price: {
    backgroundColor: color.transparent,
  },

  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
})
