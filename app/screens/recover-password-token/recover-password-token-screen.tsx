import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Header, InputText, Screen } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilFlex } from "../../theme/Util"

export const RecoverPasswordTokenScreen: FC<
  StackScreenProps<NavigatorParamList, "recoverPasswordToken">
> = observer(function RecoverPasswordTokenScreen() {
  const methods = useForm({ mode: "onBlur" })
  return (
    <Screen style={styles.root} preset="scroll">
      <Header
        leftIcon="back"
        headerTx="recoverPasswordTokenScreen.title"
        onLeftPress={goBack}
      ></Header>
      <ScrollView style={styles.containerForm}>
        <FormProvider {...methods}>
          <View style={[utilFlex.flexRow, styles.containerInputs]}>
            <InputText name="number1" style={styles.input} keyboardType="numeric"></InputText>
            <InputText name="number2" style={styles.input} keyboardType="numeric"></InputText>
            <InputText name="number3" style={styles.input} keyboardType="numeric"></InputText>
            <InputText name="number4" style={styles.input} keyboardType="numeric"></InputText>
          </View>
        </FormProvider>
      </ScrollView>
    </Screen>
  )
})

const styles = StyleSheet.create({
  containerForm: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "90%",
  },
  containerInputs: {
    justifyContent: "space-between",
  },
  input: {
    maxWidth: 100,
  },
  root: {
    backgroundColor: color.background,
  },
})
