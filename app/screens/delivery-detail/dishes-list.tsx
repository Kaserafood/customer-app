import React from "react"
import { StyleSheet, View } from "react-native"
import { Price, Text } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

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

const styles = StyleSheet.create({
  price: {
    backgroundColor: color.transparent,
  },
})
