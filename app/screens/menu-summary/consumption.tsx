import React from "react"
import { StyleSheet, View } from "react-native"
import { Separator, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"

const Consumption = () => {
  return (
    <View style={utilSpacing.px5}>
      <Text tx="menuSummary.consumption" preset="bold" size="lg" style={utilSpacing.mb3}></Text>

      <View style={utilFlex.flexRow}>
        <Text text="X5 platillos" style={utilFlex.flex1}></Text>
        <Text text="5 creditos"></Text>
      </View>
      <Separator style={utilSpacing.my3}></Separator>
      <View style={utilFlex.flexRow}>
        <Text tx="menuSummary.totalConsumption" preset="bold" style={utilFlex.flex1}></Text>
        <Text text="5 creditos"></Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Consumption
