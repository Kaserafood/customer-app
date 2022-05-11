import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { BackHandler, StyleSheet, View } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button, Header, InputText, Loader, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { UserLogin } from "../../models/user-store/user-store"
import { goBack, NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

export const LoginFormScreen: FC<StackScreenProps<NavigatorParamList, "loginForm">> = observer(
  ({ navigation }) => {
    const { commonStore, userStore } = useStores()
    const { ...methods } = useForm({ mode: "onBlur" })

    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack)

      return () => backHandler.remove()
    }, [navigation])

    const onError: SubmitErrorHandler<UserLogin> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (data: UserLogin) => {
      commonStore.setVisibleLoading(true)
      userStore
        .login(data)
        .then((userValid: boolean) => {
          if (userValid) navigation.navigate("main")
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }

    const handleBack = () => {
      goBack()
      changeNavigationBarColor(color.primary, false, true)
      return true
    }

    return (
      <>
        <Screen style={styles.container} preset="scroll" bottomBar="dark-content">
          <Header
            headerTx="loginFormScreen.title"
            leftIcon="back"
            onLeftPress={handleBack}
          ></Header>
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
                styleContainer={utilSpacing.mb6}
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
        <Loader></Loader>
      </>
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
