import { StackScreenProps } from "@react-navigation/stack"
import React, { FC } from "react"
import { View, StyleSheet } from "react-native"
import { NavigatorParamList, goBack } from "../../navigators"
import { observer } from "mobx-react-lite"
import { Header, Icon, InputText, Screen, Text } from "../../components"
import { ScrollView } from "react-native-gesture-handler"
import { FormProvider, useForm } from "react-hook-form"
import Ripple from "react-native-material-ripple"
import { color } from "../../theme"

export const CheckoutPlanScreen: FC<
  StackScreenProps<NavigatorParamList, "checkoutPlan">
> = observer(({ navigation }) => {
  return <Screen preset="fixed"></Screen>
})

const styles = StyleSheet.create({})

export default CheckoutPlanScreen
