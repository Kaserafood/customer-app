import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"

import { Price, Text } from "../../components"
import { Coupon, useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface TotalsProps {
  coupon: Coupon
  priceDelivery: number
  isPlan: boolean
}

export const Totals = (props: TotalsProps) => {
  const { cartStore, plansStore, userStore } = useStores()
  const { coupon, priceDelivery, isPlan } = props

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
            amount={cartStore.subtotal}
            currencyCode={userStore.account?.currency}
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
          <Price
            style={styles.price}
            amount={priceDelivery}
            currencyCode={userStore.account?.currency}
          ></Price>
        ) : (
          <Text tx="common.free"></Text>
        )}
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
        {isPlan ? (
          <Price
            style={styles.price}
            textStyle={utilText.bold}
            amount={plansStore.price}
            currencyCode={userStore.account?.currency}
            preset="simple"
          ></Price>
        ) : (
          <Price
            style={styles.price}
            textStyle={utilText.bold}
            amount={cartStore.subtotal + priceDelivery - cartStore.discount ?? 0}
            currencyCode={userStore.account?.currency}
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
