import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, TextStyle, ViewStyle } from "react-native"
import { Header, Screen, Text } from "../../components"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

export const PrivacyPolicyScreen: FC<
  StackScreenProps<NavigatorParamList, "privacyPolicy">
> = observer(function PrivacyPolicyScreen() {
  const textList = []

  for (let i = 1; i <= 44; i++) {
    const text1 = `privacyPolicy.text${i}`
    const styles: TextStyle = { ...utilSpacing.mb4 }
    if (i === 1) {
      styles.marginTop = spacing[4]
    }
    textList.push(<Text style={styles} tx={text1} key={i}></Text>)
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <Header headerTx="privacyPolicy.title" leftIcon="back" onLeftPress={goBack}></Header>
      <ScrollView style={utilSpacing.mx5}>{textList}</ScrollView>
    </Screen>
  )
})
