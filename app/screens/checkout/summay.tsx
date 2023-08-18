import React from "react"
import { StyleSheet, View } from "react-native"
import { Card, Price, Separator, Text } from "../../components"
import { Coupon } from "../../models"
import { spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { DishesList } from "./dishes-list"
import { Totals } from "./totals"

interface Props {
  priceDelivery: number
  coupon: Coupon
  isPlan: boolean
}

const Summary = ({ priceDelivery, coupon, isPlan }: Props) => {
  return (
    <>
      {isPlan ? (
        <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
          <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={23}>
            <View style={utilSpacing.mr3}>
              <Text text={`X 4`} numberOfLines={1} preset="semiBold"></Text>
            </View>
            <View style={utilFlex.flex1}>
              <Text preset="bold" numberOfLines={2} text={"platillos"}></Text>

              <Text
                numberOfLines={2}
                style={utilSpacing.mt2}
                caption
                preset="semiBold"
                size="sm"
                text={`2 creditos`}
              ></Text>
            </View>
            <View style={utilSpacing.ml3}>
              <Price preset="simple" amount={234} currencyCode={"GTQ"}></Price>
            </View>
          </View>
          <Separator style={styles.separator}></Separator>
          <Totals priceDelivery={priceDelivery} coupon={coupon}></Totals>
        </Card>
      ) : (
        <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
          <DishesList></DishesList>
          <Separator style={styles.separator}></Separator>
          <Totals priceDelivery={priceDelivery} coupon={coupon}></Totals>
        </Card>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
})

export default Summary
