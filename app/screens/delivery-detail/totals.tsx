import React from "react"
import { StyleSheet, View } from "react-native"
import { Price, Text } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

export const Totals = () => {
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
  price: {
    backgroundColor: color.transparent,
  },
})
