import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import IconRN from "react-native-vector-icons/MaterialIcons"
import images from "../../assets/images"
import {
  Card,
  Checkbox,
  Header,
  InputText,
  ModalDeliveryDate,
  Price,
  Screen,
  Separator,
  Text,
} from "../../components"
import { AutoImage } from "../../components/auto-image/auto-image"
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
  const { addressStore } = useStores()

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
        <Card style={[utilSpacing.mb4, utilSpacing.mx4]}>
          <Checkbox
            rounded
            style={utilSpacing.px3}
            value={true}
            preset="tiny"
            text="12pm a 3pm"
          ></Checkbox>
        </Card>
        <Card style={[utilSpacing.mb4, utilSpacing.mx4]}>
          <Checkbox style={utilSpacing.px3} rounded preset="tiny" text="4pm a 6pm"></Checkbox>
        </Card>
        <Card style={[utilSpacing.mb4, utilSpacing.mx4]}>
          <Checkbox rounded style={utilSpacing.px3} preset="tiny" text="12pm a 3pm"></Checkbox>
        </Card>
        <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.paymentMethod"
          style={[utilSpacing.mb4, utilSpacing.mx4]}
        ></Text>
        <Card style={utilSpacing.mx4}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <AutoImage style={utilSpacing.mr4} source={images.card}></AutoImage>
            <Text style={utilFlex.flex1} text="*****234324" preset="bold"></Text>
            <IconRN
              style={utilSpacing.mt2}
              name="arrow-right"
              size={35}
              color={color.palette.grayDark}
            />
          </View>
        </Card>
        <View style={utilSpacing.mx4}>
          <Separator style={utilSpacing.my6}></Separator>
          <Text preset="semiBold" tx="deliveryDetailScreen.delivery" caption></Text>
          <Text
            preset="semiBold"
            caption
            text="Martes 13 de mayo, 12pm a 3pm"
            style={utilSpacing.mb6}
          ></Text>
          <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <View style={utilSpacing.mr3}>
                <Text text="X1" preset="semiBold"></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text preset="bold" text="Enchiladas verdes"></Text>
                <Text size="sm" text="Cardne pollo" caption style={utilText.textGray}></Text>
              </View>
              <View style={utilSpacing.ml3}>
                <Price style={styles.price} amount={40}></Price>
              </View>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <View style={utilSpacing.mr3}>
                <Text text="X1" preset="semiBold"></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text preset="bold" text="Enchiladas verdes"></Text>
                <Text size="sm" text="Carne pollo" caption style={utilText.textGray}></Text>
              </View>
              <View style={utilSpacing.ml3}>
                <Price style={styles.price} amount={40}></Price>
              </View>
            </View>
            <Separator style={styles.separator}></Separator>
            <View style={utilFlex.flexRow}>
              <Text style={utilFlex.flex1} preset="bold" tx="common.subtotal"></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View style={utilFlex.flexRow}>
              <Text
                style={[utilFlex.flex1, utilSpacing.ml3]}
                preset="semiBold"
                caption
                tx="common.deliveryAmount"
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>

            <Separator style={styles.separator}></Separator>

            <View style={utilFlex.flexRow}>
              <Text preset="bold" tx="common.total"></Text>
              <Price style={styles.price} amount={300}></Price>
            </View>
          </Card>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={toEndOrder}
        activeOpacity={0.7}
        style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
      >
        <Text
          preset="bold"
          style={[styles.textAddToOrder, utilSpacing.mx3]}
          tx="dishDetailScreen.addToOrder"
        ></Text>
        <Text preset="bold" style={styles.textAddToOrder} text={`${40}`}></Text>
      </TouchableOpacity>
      <LocationModal modal={modalState}></LocationModal>
      <ModalDeliveryDate modal={modalDelivery}></ModalDeliveryDate>
    </Screen>
  )
})

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
    backgroundColor: color.background,
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
