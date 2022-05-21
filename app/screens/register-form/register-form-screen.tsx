import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button, Checkbox, Header, InputText, Loader, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { UserRegister } from "../../models/user-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { getFormatMaskPhone, getMaskLength } from "../../utils/mask"
import { showMessageInfo } from "../../utils/messages"

export const RegisterFormScreen: FC<
  StackScreenProps<NavigatorParamList, "registerForm">
> = observer(({ navigation }) => {
  const [terms, setTerms] = useState(false)
  const { ...methods } = useForm({ mode: "onChange" })
  const { userStore, commonStore } = useStores()

  const goTerms = () => navigation.navigate("termsConditions")
  const goPrivacy = () => navigation.navigate("privacyPolicy")

  const onSubmit = (data: UserRegister) => {
    if (!terms) {
      showMessageInfo("registerFormScreen.acceptsTerms")
    } else {
      commonStore.setVisibleLoading(true)
      console.log(data)
      userStore.register(data).finally(() => commonStore.setVisibleLoading(false))
    }
  }

  const onError: SubmitErrorHandler<UserRegister> = (errors) => {
    return console.log({ errors })
  }

  return (
    <>
      <Screen preset="scroll" bottomBar="dark-content">
        <Header headerTx="registerFormScreen.title" leftIcon="back" onLeftPress={goBack} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.containerForm}>
            <Text preset="semiBold" tx="registerFormScreen.info" style={utilSpacing.mb6} />

            <FormProvider {...methods}>
              <InputText
                name="name"
                placeholderTx="registerFormScreen.firstName"
                styleContainer={styles.input}
                rules={{
                  required: "registerFormScreen.firstNameRequired",
                }}
                maxLength={100}
              ></InputText>
              <InputText
                name="lastName"
                placeholderTx="registerFormScreen.lastName"
                styleContainer={styles.input}
                rules={{
                  required: "registerFormScreen.lastNameRequired",
                }}
                maxLength={100}
              ></InputText>
              <InputText
                name="phone"
                keyboardType="phone-pad"
                placeholderTx="registerFormScreen.phone"
                styleContainer={styles.input}
                rules={{
                  required: "registerFormScreen.phoneRequired",
                  minLength: {
                    value: getMaskLength(getFormatMaskPhone()),
                    message: "registerFormScreen.phoneFormatIncorrect",
                  },
                }}
                mask={getFormatMaskPhone()}
              ></InputText>
              <InputText
                name="email"
                keyboardType="email-address"
                placeholderTx="registerFormScreen.email"
                styleContainer={styles.input}
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
                placeholderTx="registerFormScreen.password"
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
              <View style={styles.containerTermsBtn}>
                <View style={styles.containerTerms}>
                  <Checkbox onToggle={() => setTerms(!terms)} value={terms}></Checkbox>
                  <View style={styles.containerTermsText}>
                    <Text size="sm" tx="registerFormScreen.acceptThe"></Text>
                    <Text
                      size="sm"
                      onPress={goTerms}
                      style={styles.textPrimary}
                      tx="registerFormScreen.termsAndConditions"
                    ></Text>
                    <Text size="sm" tx="registerFormScreen.andThe"></Text>
                    <Text
                      size="sm"
                      onPress={goPrivacy}
                      style={styles.textPrimary}
                      tx="registerFormScreen.privacyPolicy"
                    ></Text>
                  </View>
                </View>

                <Button
                  tx="registerFormScreen.register"
                  onPress={methods.handleSubmit(onSubmit, onError)}
                  block
                  style={[styles.btn, utilSpacing.mt5]}
                ></Button>
              </View>
            </FormProvider>
          </View>
        </ScrollView>
      </Screen>
      <Loader></Loader>
    </>
  )
})
const styles = StyleSheet.create({
  btn: {
    alignSelf: "center",
    display: "flex",
  },

  container: {
    alignItems: "center",
    backgroundColor: color.palette.white,
    flex: 1,
  },
  containerForm: {
    display: "flex",
    flexDirection: "column",
    paddingTop: spacing[6],
    width: "80%",
  },
  containerTerms: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: spacing[3],
  },
  containerTermsBtn: {
    alignSelf: "center",
    display: "flex",
    width: "85%",
  },
  containerTermsText: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  input: {
    color: color.palette.black,
    marginBottom: spacing[5],
  },
  lottie: {
    height: 100,
    width: 100,
  },
  textPrimary: {
    color: color.primary,
  },
})
