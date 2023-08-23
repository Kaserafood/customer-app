import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

const CreditSummary = observer(() => {
  const { plansStore, cartStore } = useStores()

  const getLabelSummary = () => {
    return `${plansStore.totalCredits - cartStore.useCredits} / ${plansStore.totalCredits}`
  }

  const getProgress = () => {
    return ((plansStore.totalCredits - cartStore.useCredits) * 100) / plansStore.totalCredits
  }

  return (
    <View style={[styles.container, utilSpacing.p5, utilSpacing.m5]}>
      <Text tx="menuSummary.remainingCredits" preset="bold" size="lg"></Text>
      <Text size="lg" preset="semiBold" text={getLabelSummary()} style={utilSpacing.mb4}></Text>
      <ProgressBar
        progress={getProgress()}
        height={7}
        backgroundColor={color.primary}
        trackColor={color.palette.whiteGray}
        progressDuration={450}
      />
      <View style={[utilFlex.flexRow, utilSpacing.mt2]}>
        <Text tx="menuSummary.expiresOn"></Text>
        <Text text={plansStore.expireDate} style={utilSpacing.ml2}></Text>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[3],
    borderWidth: 1,
  },
})

export default CreditSummary
