import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Checkbox, Header, InputText, Screen, Text } from "../../components"
import { Address, useStores } from "../../models"
import { UserRegister } from "../../models/user-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { spacing } from "../../theme"
import { color } from "../../theme/color"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getFormatMaskPhone, getMaskLength } from "../../utils/mask"
import { showMessageInfo } from "../../utils/messages"
import { loadString } from "../../utils/storage"

export const RegisterFormScreen: FC<
  StackScreenProps<NavigatorParamList, "registerForm">
> = observer(({ navigation }) => {
  const [terms, setTerms] = useState(false)
  const { ...methods } = useForm({ mode: "onBlur" })
  const { userStore, commonStore, addressStore } = useStores()

  const goTerms = () => navigation.navigate("termsConditions")
  const goPrivacy = () => navigation.navigate("privacyPolicy")

  const onSubmit = (data: UserRegister) => {
    if (!terms) showMessageInfo("registerFormScreen.acceptsTerms")
    else {
      Keyboard.dismiss()
      commonStore.setVisibleLoading(true)
      __DEV__ && console.log(data)
      const currentUserId = userStore.userId
      userStore
        .register(data)
        .then(async (userId) => {
          if (userId > 0) {
            // Si el usuario habia entrado como "Explorar el app"
            if (currentUserId === -1) {
              await saveAddress(userId)
            } else commonStore.setIsSignedIn(true)
          }
          commonStore.setVisibleLoading(false)
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }
  }

  const onError: SubmitErrorHandler<UserRegister> = (errors) => {
    __DEV__ && console.log({ errors })
  }

  const saveAddress = async (userId: number) => {
    const currentAddress = await loadString("address")
    if (currentAddress.length > 0) {
      const address: Address = JSON.parse(currentAddress)
      address.userId = userId
      await addressStore.add(address).then((res) => {
        if (res) {
          address.id = Number(res.data)
          addressStore.setCurrent({ ...address })
          userStore.setAddressId(address.id)
          userStore.updateAddresId(userId, address.id)
          commonStore.setIsSignedIn(true)
          navigation.navigate("deliveryDetail")
        }
      })
    }
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
                <View style={[utilFlex.flexRow, utilSpacing.mb4, utilFlex.flexCenterVertical]}>
                  <TouchableOpacity
                    onPress={() => setTerms(!terms)}
                    activeOpacity={1}
                    style={utilSpacing.p4}
                  >
                    <Checkbox value={terms}></Checkbox>
                  </TouchableOpacity>

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

  containerTermsBtn: {
    alignSelf: "center",
    display: "flex",
    width: "100%",
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
