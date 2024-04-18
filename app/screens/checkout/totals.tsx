import React from "react"
import { StyleSheet, View } from "react-native"

import { useQuery } from "react-query"
import { Price, Text } from "../../components"
import { useStores } from "../../models"
import { Api, ValueResponse } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface TotalsProps {
  priceDelivery: number
}

const api = new Api()
export const Totals = (props: TotalsProps) => {
  const { cartStore, userStore, messagesStore } = useStores()
  const { priceDelivery } = props

  useQuery("get-tax-percentage", () => api.getTaxPercentage(), {
    onSuccess: (data: ValueResponse) => {
      cartStore.setTaxPercentage(Number(data.data.value))
    },
    onError: () => {
      messagesStore.showError()
    },
  })

  return (
    <View>
      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.subtotal"></Text>

        <Price
          style={styles.price}
          textStyle={utilText.semiBold}
          amount={cartStore.subtotal}
          currencyCode={userStore.account?.currency}
          preset="simple"
        ></Price>
      </View>

      {cartStore.discount > 0 && (
        <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
          <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.discount"></Text>
          <Price preset="simple" textStyle={utilText.semiBold} amount={cartStore.discount}></Price>
        </View>
      )}

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.deliveryAmount"></Text>
        {priceDelivery > 0 ? (
          <Price preset="simple" textStyle={utilText.semiBold} amount={priceDelivery}></Price>
        ) : (
          <Text tx="common.free" style={utilText.semiBold}></Text>
        )}
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>

        <Price
          textStyle={utilText.bold}
          amount={cartStore.calculateTotalForDishes(priceDelivery)}
          preset="simple"
        ></Price>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  price: {
    backgroundColor: color.transparent,
  },
})
