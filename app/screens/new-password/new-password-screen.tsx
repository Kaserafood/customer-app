import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { Button, Header, InputText, Screen, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

export const NewPasswordScreen: FC<StackScreenProps<NavigatorParamList, "newPassword">> = observer(
  function NewPasswordScreen() {
    const methods = useForm({ mode: "onBlur" })

    const onError: SubmitErrorHandler<any> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (form) => {
      console.log("onSubmit", form)
    }

    return (
      <Screen style={styles.container} preset="scroll">
        <Header headerTx="newPasswordScreen.title" leftIcon="back" onLeftPress={goBack}></Header>

        <View style={styles.containerForm}>
          <Text preset="semiBold" tx="newPasswordScreen.info" style={utilSpacing.mb5}></Text>

          <FormProvider {...methods}>
            <InputText
              name="password"
              placeholderTx="newPasswordScreen.passwordPlaceholder"
              styleContainer={styles.input}
              secureTextEntry
              rules={{
                required: "newPasswordScreen.passwordRequired",
                minLength: {
                  value: 4,
                  message: "newPasswordScreen.passwordMinLength",
                },
              }}
              maxLength={100}
            ></InputText>

            <InputText
              name="passwordConfirm"
              placeholderTx="newPasswordScreen.passwordConfirmPlaceholder"
              styleContainer={styles.input}
              secureTextEntry
              rules={{
                required: "newPasswordScreen.passwordConfirmRequired",
                minLength: {
                  value: 4,
                  message: "newPasswordScreen.passwordMinLength",
                },
              }}
              maxLength={100}
            ></InputText>

            <View style={[styles.containerBtn, utilSpacing.mt9]}>
              <Button
                tx="newPasswordScreen.save"
                style={[styles.btn, utilSpacing.py5]}
                onPress={methods.handleSubmit(onSubmit, onError)}
              ></Button>
            </View>
          </FormProvider>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btn: {
    width: "90%",
  },
  container: {
    alignItems: "center",
    backgroundColor: color.background,
    flex: 1,
  },
  containerBtn: {
    alignItems: "center",
    display: "flex",
  },
  containerForm: {
    display: "flex",
    flexDirection: "column",
    paddingTop: spacing[6],
    width: "75%",
  },
  input: {
    marginBottom: spacing[5],
  },
})
