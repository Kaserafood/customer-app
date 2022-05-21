import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { Header, Screen, Text } from "../../components"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

export const PrivacyPolicyScreen: FC<
  StackScreenProps<NavigatorParamList, "privacyPolicy">
> = observer(function PrivacyPolicyScreen() {
  return (
    <Screen style={ROOT} preset="scroll">
      <Header headerTx="privacyPolicy.title" leftIcon="back" onLeftPress={goBack}></Header>
      <ScrollView style={utilSpacing.m6}>
        <Text tx="privacyPolicy.text1"></Text>
      </ScrollView>
    </Screen>
  )
})
