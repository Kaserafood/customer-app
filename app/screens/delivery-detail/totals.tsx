import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"

import { Price, Text } from "../../components"
import { Coupon, useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface TotalsProps {
  coupon: Coupon
}

export const Totals = (props: TotalsProps) => {
  const { cartStore, deliveryStore } = useStores()
  const [currencyCode, setCurrencyCode] = useState("")
  const { coupon } = props

  useEffect(() => {
    if (cartStore.cart.length > 0) setCurrencyCode(cartStore.cart[0].dish.chef.currencyCode)
  }, [])

  useEffect(() => {
    if (coupon?.id > 0) {
      if (coupon.discountType === "percent") {
        cartStore.setDiscount((coupon.amount * cartStore.subtotal) / 100)
      }
    }
  }, [coupon])

  return (
    <View>
      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.subtotal"></Text>
        <Price style={styles.price} amount={cartStore.subtotal} currencyCode={currencyCode}></Price>
      </View>

      {cartStore.discount > 0 && (
        <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
          <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.discount"></Text>
          <Price
            style={styles.price}
            amount={cartStore.discount}
            currencyCode={currencyCode}
          ></Price>
        </View>
      )}

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.deliveryAmount"></Text>
        <Price
          style={styles.price}
          amount={deliveryStore.priceDelivery}
          currencyCode={currencyCode}
        ></Price>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
        <Price
          style={styles.price}
          textStyle={utilText.bold}
          amount={cartStore.subtotal + deliveryStore.priceDelivery - cartStore.discount ?? 0}
          currencyCode={currencyCode}
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
