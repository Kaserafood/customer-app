import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { Button, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { toFormatDate } from "../../utils/date"
import { getI18nText } from "../../utils/translate"

interface Props {
  onRecharge: () => void
}

const CreditSummary = observer(({ onRecharge }: Props) => {
  const { plansStore, cartStore } = useStores()
  const navigation = useNavigation()

  const labelSummary = useMemo(() => {
    return `${plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)} / ${
      plansStore.totalCredits
    }`
  }, [plansStore.totalCredits, cartStore.useCredits, plansStore.consumedCredits])

  const progress = useMemo(() => {
    return (
      ((plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)) * 100) /
      plansStore.totalCredits
    )
  }, [plansStore.totalCredits, cartStore.useCredits, plansStore.consumedCredits])

  const getColorBar = () => {
    if (progress > 60) {
      return color.palette.green
    } else if (progress > 25) {
      return color.palette.yellow
    } else {
      return color.palette.red
    }
  }

  const handleRecharge = () => {
    onRecharge()
  }

  const toSubscription = () => {
    navigation.navigate("subscription" as never)
  }

  return (
    <View
      style={[
        styles.container,
        utilSpacing.p5,
        utilSpacing.m5,
        utilFlex.flexRow,
        utilFlex.flexCenterVertical,
      ]}
    >
      {!plansStore.hasActivePlan ? (
        <>
          <Text
            text={getI18nText("plansScreen.packageExpired", {
              date: toFormatDate(new Date(plansStore.expireDate), "DD/MM/YYYY"),
            })}
            preset="bold"
            size="lg"
          ></Text>

          <Button
            tx="plansScreen.recharge"
            style={[utilSpacing.py3, utilSpacing.px1, utilSpacing.mt5, styles.btnSelect]}
            onPress={toSubscription}
          ></Button>
        </>
      ) : (
        <View style={utilFlex.flex1}>
          <Text tx="menuSummary.remainingCredits" preset="bold" size="lg"></Text>
          <Text size="lg" preset="semiBold" text={labelSummary} style={utilSpacing.mb4}></Text>
          <ProgressBar
            progress={progress}
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

          <Button
            tx="plansScreen.recharge"
            style={[
              utilSpacing.py3,
              // utilSpacing.ml4,
              utilSpacing.px1,
              utilSpacing.mt5,
              styles.btnSelect,
            ]}
            onPress={handleRecharge}
          ></Button>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  btnSelect: {
    backgroundColor: color.palette.green,
    width: "auto",
  },
  container: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[3],
    borderWidth: 1,
  },
})

export default CreditSummary
