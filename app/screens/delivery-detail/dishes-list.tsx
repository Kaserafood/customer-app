import React from "react"
import { StyleSheet, View } from "react-native"
import { CartItemAddon, Price, Text } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

export const DishesList = () => {
  const { cartStore } = useStores()
  return (
    <View>
      {cartStore.cart.map((item) => (
        <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={item.dish.id}>
          <View style={utilSpacing.mr3}>
            <Text text={`X ${item.quantity}`} numberOfLines={1} preset="semiBold"></Text>
          </View>
          <View style={utilFlex.flex1}>
            <Text preset="bold" numberOfLines={2} text={item.dish.title}></Text>
            <CartItemAddon metaDataCart={item.metaData}></CartItemAddon>
          </View>
          <View style={utilSpacing.ml3}>
            <Price
              style={styles.price}
              amount={item.total}
              currencyCode={item.dish.chef.currencyCode}
            ></Price>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  price: {
    backgroundColor: color.transparent,
  },
})
