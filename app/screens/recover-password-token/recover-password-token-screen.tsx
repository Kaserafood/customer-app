import React, { FC, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Header, InputText, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

export const RecoverPasswordTokenScreen: FC<
  StackScreenProps<NavigatorParamList, "recoverPasswordToken">
> = observer(({ navigation, route: { params } }) => {
  const { ...methods } = useForm({ mode: "onBlur" })
  const { userStore, commonStore, messagesStore } = useStores()

  // Refs inputs for focus
  const first = useRef(null)
  const second = useRef(null)
  const third = useRef(null)
  const fourth = useRef(null)

  const changeFocus = (name: string, text: string) => {
    text = text.substring(0, 1)

    methods.setValue(name, text)
    if (text.length === 1) {
      switch (name) {
        case "first":
          second.current.focus()
          break
        case "second":
          third.current.focus()
          break
        case "third":
          fourth.current.focus()
          break
        case "fourth":
          break
      }
    } else {
      switch (name) {
        case "first":
          break
        case "second":
          first.current.focus()
          break
        case "third":
          second.current.focus()
          break
        case "fourth":
          third.current.focus()
          break
      }
    }

    if (validLengthInputs()) validToken()
  }

  const getInputValues = () => {
    return [
      methods.getValues("first") ?? "",
      methods.getValues("second") ?? "",
      methods.getValues("third") ?? "",
      methods.getValues("fourth") ?? "",
    ]
  }

  const validLengthInputs = () => {
    const values = getInputValues()
    const isValid = values.every((value) => value.length === 1)
    return isValid
  }

  const validToken = () => {
    Keyboard.dismiss()
    commonStore.setVisibleLoading(true)

    userStore
      .validTokenRecoverPassword(getInputValues().join(""), params.email)
      .then((isValid: boolean) => {
        isValid && navigation.navigate("newPassword", { email: params.email })
      })
      .catch((error: Error) => {
        messagesStore.showError(error.message)
      })
      .finally(() => commonStore.setVisibleLoading(false))
  }

  return (
    <Screen style={styles.root} preset="fixed">
      <Header
        leftIcon="back"
        headerTx="recoverPasswordTokenScreen.title"
        onLeftPress={goBack}
      ></Header>
      <ScrollView style={styles.containerForm}>
        <Text
          preset="semiBold"
          tx="recoverPasswordTokenScreen.info"
          style={[utilSpacing.mb8, utilSpacing.mt8]}
        />
        <FormProvider {...methods}>
          <View style={[utilFlex.flexRow, styles.containerInputs]}>
            <InputText
              forwardedRef={first}
              name="first"
              styleContainer={styles.input}
              keyboardType="numeric"
              textAlign="center"
              onKeyPress={(e) => e.nativeEvent.key === "Backspace" && changeFocus("first", "")}
              onChangeText={(text) => {
                changeFocus("first", text)
              }}
              maxLength={1}
            ></InputText>
            <InputText
              forwardedRef={second}
              name="second"
              styleContainer={styles.input}
              keyboardType="numeric"
              textAlign="center"
              onKeyPress={(e) => e.nativeEvent.key === "Backspace" && changeFocus("second", "")}
              onChangeText={(text) => {
                changeFocus("second", text)
              }}
              maxLength={1}
            ></InputText>
            <InputText
              forwardedRef={third}
              name="third"
              styleContainer={styles.input}
              keyboardType="numeric"
              textAlign="center"
              onKeyPress={(e) => e.nativeEvent.key === "Backspace" && changeFocus("third", "")}
              onChangeText={(text) => {
                changeFocus("third", text)
              }}
              maxLength={1}
            ></InputText>
            <InputText
              forwardedRef={fourth}
              name="fourth"
              styleContainer={styles.input}
              keyboardType="numeric"
              textAlign="center"
              onKeyPress={(e) => e.nativeEvent.key === "Backspace" && changeFocus("fourth", "")}
              onChangeText={(text) => {
                changeFocus("fourth", text)
              }}
              maxLength={1}
            ></InputText>
          </View>
        </FormProvider>
      </ScrollView>

      {/* <Loader></Loader> */}
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
    flex: 1,
    margin: spacing[3],
    maxWidth: 100,
  },
  root: {
    backgroundColor: color.background,
  },
})
