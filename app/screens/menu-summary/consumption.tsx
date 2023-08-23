import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Separator, Text } from "../../components"
import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

const Consumption = observer(() => {
  const { cartStore } = useStores()
  return (
    <View style={utilSpacing.px5}>
      <Text tx="menuSummary.consumption" preset="bold" size="lg" style={utilSpacing.mb3}></Text>

      <View style={utilFlex.flexRow}>
        <Text
          text={`X${cartStore.countQuantityItemsPlan} ${getI18nText("common.dishes")}`}
          style={utilFlex.flex1}
        ></Text>
        <Text text={`${cartStore.useCredits} ${getI18nText("common.credits")}`}></Text>
      </View>
      <Separator style={utilSpacing.my3}></Separator>
      <View style={utilFlex.flexRow}>
        <Text tx="menuSummary.totalConsumption" preset="bold" style={utilFlex.flex1}></Text>
        <Text text={`${cartStore.useCredits} ${getI18nText("common.credits")}`}></Text>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({})

export default Consumption
