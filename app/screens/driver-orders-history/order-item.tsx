import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Card, Price, Text } from "../../components"
import Label from "../../components/label/label"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface Props {
  id: number
  code?: string
  codeCredit?: string
  customerName: string
  total: number
  border: boolean
  status: string
  isToday?: boolean
  tax: string
  paidDriver: boolean
  driverCanceled: boolean
  onPress: () => void
  pickUpAddress: string
  customerAddress: string
  deliveryTime: string
  driverPayment: number
}

const OrderItem = ({
  customerName,
  id,
  code,
  codeCredit,
  paidDriver,
  status,
  driverCanceled,
  onPress,
  pickUpAddress,
  customerAddress,
  driverPayment,
}: Props) => {
  return (
    <Card style={[utilSpacing.mb5, utilSpacing.p4]}>
      <View style={utilFlex.flexRow}>
        <View style={[utilFlex.flexRow, utilFlex.flex1]}>
          <Text text={`#${code || codeCredit || id}`} preset="bold"></Text>
          <Text text=" - " preset="bold"></Text>
          <Text text={customerName} preset="bold"></Text>
        </View>

        <Button
          preset="gray"
          style={utilSpacing.mr3}
          tx="common.view"
          size="sm"
          onPress={onPress}
        ></Button>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text
            tx="driverOrdersScreen.pickUpAddress"
            preset="semiBold"
            style={utilSpacing.mt3}
          ></Text>
          <Text text={`${pickUpAddress}`}></Text>
        </View>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text
            tx="driverOrdersScreen.deliveryAddress"
            preset="semiBold"
            style={utilSpacing.mt3}
          ></Text>
          <Text text={`${customerAddress}`}></Text>
        </View>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text tx="common.revenue" preset="semiBold" style={utilSpacing.mt3}></Text>
          <Price preset="simple" textStyle={utilText.regular} amount={driverPayment}></Price>
        </View>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mt5, styles.containerButtons]}>
        <View>{paidDriver && <Label preset="info" tx="common.paid"></Label>}</View>

        {driverCanceled && <Label preset="error" tx="driverOrdersScreen.noDeliver"></Label>}

        {status === "wc-billing" ||
          (status === "wc-completed" && <Label tx="common.completed" preset="success"></Label>)}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  containerButtons: {
    justifyContent: "space-between",
  },
})

export default OrderItem
