import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { ButtonFooter, Header, InputText, Screen } from "../../components/"

import { FormProvider, useForm } from "react-hook-form"
import { NavigatorParamList, goBack } from "../../navigators"
import { utilSpacing } from "../../theme/Util"
import Consumption from "./consumption"
import CreditSummary from "./credit-summary"
import ScheduleDelivery from "./schedule-delivery"

export const MenuSummaryScreen: FC<StackScreenProps<NavigatorParamList, "menuSummary">> = observer(
  ({ navigation, route: { params } }) => {
    const methods = useForm({
      defaultValues: {
        note: "",
      },
    })

    return (
      <Screen preset="fixed">
        <Header headerTx="menuSummary.title" leftIcon="back" onLeftPress={goBack} />
        <FormProvider {...methods}>
          <ScrollView style={utilSpacing.pb6}>
            <CreditSummary></CreditSummary>
            <Consumption></Consumption>
            <ScheduleDelivery></ScheduleDelivery>
            <View style={[styles.containerInput, utilSpacing.py4]}>
              <InputText
                name="note"
                preset="card"
                labelTx="menuSummary.commentChef"
                placeholderTx="common.writeHere"
                counter={100}
              ></InputText>
            </View>
          </ScrollView>
          <ButtonFooter tx="common.confirm"></ButtonFooter>
        </FormProvider>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  containerInput: {
    backgroundColor: "#cccccc30",
  },
})
