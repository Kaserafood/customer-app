import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { BackHandler, Keyboard, StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button, Header, InputText, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { UserLogin } from "../../models/user-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

export const LoginFormScreen: FC<StackScreenProps<NavigatorParamList, "loginForm">> = observer(
  ({ navigation }) => {
    const { commonStore, userStore } = useStores()
    const { ...methods } = useForm({ mode: "onBlur" })

    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack)

      return () => backHandler.remove()
    }, [navigation])

    const onError: SubmitErrorHandler<UserLogin> = (errors) => {
      __DEV__ && console.log({ errors })
    }

    const onSubmit = (data: UserLogin) => {
      Keyboard.dismiss()
      commonStore.setVisibleLoading(true)
      userStore
        .login(data)
        .then((userValid: boolean) => {
          commonStore.setVisibleLoading(false)
          if (userValid) commonStore.setIsSignedIn(true)
        })
        .catch(() => commonStore.setVisibleLoading(false))
    }

    const handleBack = () => {
      goBack()
      changeNavigationBarColor(color.primary, false, true)
      return true
    }

    const toRecoverPassword = () => {
      navigation.navigate("recoverPassword")
    }

    return (
      <>
        <Screen style={styles.container} preset="fixed" bottomBar="dark-content">
          <Header
            headerTx="loginFormScreen.title"
            leftIcon="back"
            onLeftPress={handleBack}
          ></Header>
          <ScrollView style={styles.w100} contentContainerStyle={utilFlex.flexCenterHorizontal}>
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
                  maxLength={200}
                ></InputText>
                <InputText
                  name="password"
                  placeholderTx="loginFormScreen.password"
                  styleContainer={styles.input}
                  secureTextEntry
                  rules={{
                    required: "registerFormScreen.passwordRequired",
                    minLength: {
                      value: 4,
                      message: "registerFormScreen.passwordMinLength",
                    },
                  }}
                  maxLength={100}
                ></InputText>

                <View style={[styles.containerBtn, utilSpacing.mt9]}>
                  <Button
                    tx="loginFormScreen.continue"
                    style={[styles.btn, utilSpacing.py5]}
                    onPress={methods.handleSubmit(onSubmit, onError)}
                  ></Button>
                </View>
              </FormProvider>
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                rippleContainerBorderRadius={10}
                style={[utilSpacing.py5, utilSpacing.px6, utilSpacing.mt7, utilFlex.selfCenter]}
                onPress={toRecoverPassword}
              >
                <Text preset="bold" size="lg" tx="loginFormScreen.recoverPassword"></Text>
              </Ripple>
            </View>
          </ScrollView>
        </Screen>
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
  w100: {
    width: "100%",
  },
})
