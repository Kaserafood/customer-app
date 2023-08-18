import React from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

const CreditSummary = () => {
  return (
    <View style={[styles.container, utilSpacing.p5, utilSpacing.m5]}>
      <Text tx="menuSummary.remainingCredits" preset="bold" size="lg"></Text>
      <Text size="lg" preset="semiBold" text="32.5/40" style={utilSpacing.mb4}></Text>
      <ProgressBar
        progress={50}
        height={7}
        backgroundColor={color.primary}
        trackColor={color.palette.whiteGray}
        progressDuration={450}
      />
      <View style={[utilFlex.flexRow, utilSpacing.mt2]}>
        <Text tx="menuSummary.expiresOn"></Text>
        <Text text="20/01/4124" style={utilSpacing.ml2}></Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[3],
    borderWidth: 1,
  },
})

export default CreditSummary
