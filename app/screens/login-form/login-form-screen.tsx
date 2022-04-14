import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import { Screen, Text, Header, InputText, Button } from "../../components"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { useStores } from "../../models"
import { IUserLogin } from "../../models/user-store/user-store"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
}

export const LoginFormScreen: FC<StackScreenProps<NavigatorParamList, "loginForm">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    const { modalStore, userStore } = useStores()

    const { ...methods } = useForm({ mode: "onChange" })
    const [formError, setError] = useState<boolean>(false)

    const onError: SubmitErrorHandler<IUserLogin> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (data) => {
      modalStore.setVisibleLoading(true)
      userStore
        .login(data)
        .then(() => {
          navigation.navigate("main")
        })
        .finally(() => modalStore.setVisibleLoading(false))
    }

    return (
      <Screen style={ROOT} preset="scroll" bottomBar="dark-content">
        <Header headerTx="loginFormScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <View style={styles.containerForm}>
          <Text
            preset="semiBold"
            tx="loginFormScreen.info"
            style={[utilSpacing.mb8, utilSpacing.mt4]}
          />

          <FormProvider {...methods}>
            <InputText
              name="email"
              keyboardType="email-address"
              placeholderTx="loginFormScreen.email"
              styleContainer={utilSpacing.mb3}
              setFormError={setError}
              rules={{
                required: "registerFormScreen.emailRequired",
                pattern: {
                  value: /\b[\w\\.+-]+@[\w\\.-]+\.\w{2,4}\b/,
                  message: "registerFormScreen.emailFormat",
                },
              }}
            ></InputText>
            <InputText
              name="password"
              placeholderTx="loginFormScreen.password"
              styleContainer={styles.input}
              secureTextEntry
              rules={{
                required: "registerFormScreen.passwordRequired",
              }}
              setFormError={setError}
            ></InputText>

            <View style={[styles.containerBtn, utilSpacing.mt9]}>
              <Button
                tx="loginFormScreen.continue"
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
