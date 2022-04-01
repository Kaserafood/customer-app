import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ScrollView, TextStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Header, Screen, Text } from "../../components"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { goBack } from "../../navigators/navigation-utilities"
import { spacing } from "../../theme/spacing"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

export const TermsConditionsScreen: FC<
  StackScreenProps<NavigatorParamList, "termsConditions">
> = observer(function TermsConditionsScreen() {
  const textList = []

  for (let i = 1; i <= 23; i++) {
    const text1 = "termsConditionsScreen.text" + i
    const styles: TextStyle = { ...utilSpacing.mb4 }
    if (i === 1) {
      styles.marginTop = spacing[4]
    }
    textList.push(<Text style={styles} tx={text1} key={i}></Text>)
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <Header headerTx="termsConditionsScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
      <ScrollView style={utilSpacing.mx5}>{textList}</ScrollView>
    </Screen>
  )
})
