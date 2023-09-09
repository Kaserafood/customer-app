import React from "react"
import { StyleSheet, View } from "react-native"
import { Card, Price, Separator, Text } from "../../components"
import { Coupon, useStores } from "../../models"
import { spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { DishesList } from "./dishes-list"
import { Totals } from "./totals"

interface Props {
  priceDelivery: number
  coupon: Coupon
  isPlan: boolean
}

const Summary = ({ priceDelivery, coupon, isPlan }: Props) => {
  const { plansStore, userStore } = useStores()

  const getType = () => {
    if (plansStore.type === "happy") {
      return getI18nText(`checkoutScreen.happy`)
    } else if (plansStore.type === "prime") {
      return getI18nText(`checkoutScreen.prime`)
    } else if (plansStore.type === "test") {
      return getI18nText(`checkoutScreen.test`)
    } else {
      return getI18nText(`checkoutScreen.custom`)
    }
  }

  return (
    <>
      {isPlan ? (
        <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
          <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={23}>
            <View style={utilSpacing.mr3}>
              <Text text={`X 1`} numberOfLines={1} preset="semiBold"></Text>
            </View>
            <View style={utilFlex.flex1}>
              <Text preset="bold" numberOfLines={2} text={getType()}></Text>

              <Text
                numberOfLines={2}
                style={utilSpacing.mt2}
                caption
                preset="semiBold"
                size="sm"
                text={`${plansStore.totalCredits} ${getI18nText("common.credits")} (${getI18nText(
                  "common.dishes",
                )})`}
              ></Text>
            </View>
            <View style={utilSpacing.ml3}>
              <Price
                preset="simple"
                amount={plansStore.price}
                currencyCode={userStore.account.currency}
                textStyle={utilText.semiBold}
              ></Price>
            </View>
          </View>
          <Separator style={styles.separator}></Separator>
          <Totals priceDelivery={priceDelivery} coupon={coupon} isPlan={isPlan}></Totals>
        </Card>
      ) : (
        <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
          <DishesList></DishesList>
          <Separator style={styles.separator}></Separator>
          <Totals priceDelivery={priceDelivery} coupon={coupon} isPlan={isPlan}></Totals>
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
