import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { toFormatDate } from "../../utils/date"

const CreditSummary = observer(() => {
  const { plansStore, cartStore } = useStores()

  const getLabelSummary = () => {
    return `${plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)} / ${
      plansStore.totalCredits
    }`
  }

  const getProgress = () => {
    return (
      ((plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)) * 100) /
      plansStore.totalCredits
    )
  }

  const getColorBar = () => {
    if (getProgress() > 60) {
      return color.palette.green
    } else if (getProgress() > 25) {
      return color.palette.yellow
    } else {
      return color.palette.red
    }
  }

  return (
    <View style={[styles.container, utilSpacing.p5, utilSpacing.m5]}>
      <Text tx="menuSummary.remainingCredits" preset="bold" size="lg"></Text>
      <Text size="lg" preset="semiBold" text={getLabelSummary()} style={utilSpacing.mb4}></Text>
      <ProgressBar
        progress={getProgress()}
        height={7}
        backgroundColor={getColorBar()}
        trackColor={color.palette.whiteGray}
        progressDuration={450}
      />
      <View style={[utilFlex.flexRow, utilSpacing.mt2]}>
        <Text tx="menuSummary.expiresOn"></Text>
        <Text
          text={toFormatDate(new Date(plansStore.expireDate), "DD/MM/YYYY")}
          style={utilSpacing.ml2}
        ></Text>
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
