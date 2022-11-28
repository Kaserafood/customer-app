import React, { FC } from "react"
import { ScrollView, TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Header, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilSpacing } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

export const TermsConditionsScreen: FC<
  StackScreenProps<NavigatorParamList, "termsConditions">
> = observer(function TermsConditionsScreen() {
  const textList = []

  for (let i = 1; i <= 61; i++) {
    const text1 = `termsConditionsScreen.text${i}`
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
