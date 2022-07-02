import React from "react"
import { StyleSheet, View } from "react-native"
import { Price, Text } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

export const Totals = () => {
  const { cartStore, orderStore } = useStores()
  const { currencyCode } = cartStore.cart[0].dish.chef
  return (
    <View>
      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.subtotal"></Text>
        <Price style={styles.price} amount={cartStore.subtotal} currencyCode={currencyCode}></Price>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="semiBold" caption tx="common.deliveryAmount"></Text>
        <Price
          style={styles.price}
          amount={orderStore.priceDelivery}
          currencyCode={currencyCode}
        ></Price>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
        <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
        <Price
          style={styles.price}
          textStyle={utilText.bold}
          amount={cartStore.subtotal + orderStore.priceDelivery}
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
