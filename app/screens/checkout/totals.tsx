import React, { useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"

import { useQuery } from "react-query"
import { Price, Text } from "../../components"
import { Coupon, useStores } from "../../models"
import { Api, ValueResponse } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface TotalsProps {
  coupon: Coupon
  priceDelivery: number
  isPlan: boolean
}

const api = new Api()
export const Totals = (props: TotalsProps) => {
  const { cartStore, plansStore, userStore, messagesStore } = useStores()
  const { coupon, priceDelivery, isPlan } = props

  const taxAmount = useMemo(() => cartStore.calculateTaxAmount(priceDelivery, plansStore.price), [
    cartStore,
    plansStore.price,
    priceDelivery,
    cartStore.taxPercentage,
  ])

  useEffect(() => {
    if (coupon?.id > 0) {
      if (coupon.discountType === "percent") {
        cartStore.setDiscount((coupon.amount * cartStore.subtotal) / 100)
      }
    }
  }, [coupon])

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
        {isPlan ? (
          <Price
            style={styles.price}
            textStyle={utilText.semiBold}
            amount={plansStore.price}
            currencyCode={userStore.account?.currency}
            preset="simple"
          ></Price>
        ) : (
          <Price
            style={styles.price}
            textStyle={utilText.semiBold}
            amount={cartStore.subtotal}
            currencyCode={userStore.account?.currency}
            preset="simple"
          ></Price>
        )}
      </View>

      {cartStore.discount > 0 && (
        <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
          <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.discount"></Text>
          <Price
            style={styles.price}
            amount={cartStore.discount}
            currencyCode={userStore.account?.currency}
          ></Price>
        </View>
      )}

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.deliveryAmount"></Text>
        {priceDelivery > 0 ? (
          <Price preset="simple" textStyle={utilText.semiBold} amount={priceDelivery}></Price>
        ) : (
          <Text tx="common.free"></Text>
        )}
      </View>

      {taxAmount > 0 && (
        <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
          <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.taxAmount"></Text>
          <Price preset="simple" textStyle={utilText.semiBold} amount={taxAmount}></Price>
        </View>
      )}

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
        {isPlan ? (
          <Price
            textStyle={utilText.bold}
            amount={cartStore.calculateTotalForPlans(plansStore.price, priceDelivery)}
            preset="simple"
          ></Price>
        ) : (
          <Price
            textStyle={utilText.bold}
            amount={cartStore.calculateTotalForDishes(priceDelivery)}
            preset="simple"
          ></Price>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  price: {
    backgroundColor: color.transparent,
  },
})
