import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useLayoutEffect, useRef } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, ScrollView, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import OneSignal from "react-native-onesignal"

import * as RNLocalize from "react-native-localize"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import RNUxcam from "react-native-ux-cam"
import { UXCamOcclusionType } from "react-native-ux-cam/UXCamOcclusion"
import { Button, Icon, InputText, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { UserRegister } from "../../models/user-store"
import { goBack } from "../../navigators"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { Api } from "../../services/api"
import { spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { color } from "../../theme/color"
import { GUATEMALA, UNITED_STATES } from "../../utils/constants"
import { getMaskLength } from "../../utils/mask"
import { getInstanceMixpanel } from "../../utils/mixpanel"

const hideTextFields = {
  type: UXCamOcclusionType.OccludeAllTextFields,
  screens: [],
}
const api = new Api()
const mixpanel = getInstanceMixpanel()
export const RegisterFormScreen: FC<
  StackScreenProps<NavigatorParamList, "registerForm">
> = observer(({ navigation }) => {
  // const [terms, setTerms] = useState(false)
  const { ...methods } = useForm({ mode: "onBlur" })
  const {
    userStore,
    commonStore,
    addressStore,
    messagesStore,
    countryStore,
    cartStore,
  } = useStores()
  const fieldPhone = useRef(null)

  const goTerms = () => navigation.navigate("termsConditions")
  const goPrivacy = () => navigation.navigate("privacyPolicy")

  useEffect(() => {
    RNUxcam.applyOcclusion(hideTextFields)
    mixpanel.track("Register Screen")
  }, [])

  useLayoutEffect(() => {
    changeNavigationBarColor(color.palette.white, false, true)
  }, [])

  useEffect(
    () =>
      navigation.addListener("beforeRemove", () => {
        RNUxcam.removeOcclusion(hideTextFields)
      }),
    [navigation],
  )

  const onSubmit = (data: UserRegister) => {
    // if (!terms) messagesStore.showInfo("registerFormScreen.acceptsTerms", true)
    // else {
    Keyboard.dismiss()
    commonStore.setVisibleLoading(true)
    __DEV__ && console.log(data)
    const currentUserId = userStore.userId
    userStore
      .register({ ...data, countryId: userStore.countryId })
      .then(async (userId) => {
        if (userId > 0) {
          let id = userId.toString()
          if (userStore.countryId === UNITED_STATES) {
            id = `us_${userId}`
            OneSignal.sendTag("country", "US")
          }

          OneSignal.setExternalUserId(id)
          OneSignal.setEmail(data.email)

          RNUxcam.setUserProperty("userId", id)
          RNUxcam.setUserIdentity(id)
          mixpanel.identify(id)
          await getAccount()

          RNUxcam.logEvent("register", {
            exploreApp: currentUserId === -1,
          })
          mixpanel.track("Register completed", {
            exploreApp: currentUserId === -1,
          })
          OneSignal.sendTag("registered", "1")
          commonStore.setIsSignedIn(true)
          commonStore.setVisibleLoading(false)

          if (currentUserId === -1) {
            // await saveAddress(userId)
            // commonStore.setVisibleLoading(false)
            userStore.setAddressId(-1)
            navigation.navigate("checkout", { isPlan: cartStore.inRechargeProcess })
          } else {
            navigation.navigate("map")
          }
        }
      })
      .catch((error: Error) => {
        commonStore.setVisibleLoading(false)
        messagesStore.showError(error.message)
      })
    // }
  }

  const getAccount = async () => {
    await api.getAccount(userStore.userId, RNLocalize.getTimeZone()).then((res) => {
      const { currency, date, role, isGeneralRegime, kaseraTaxId } = res.data
      userStore.setAccount({ currency, date, role, isGeneralRegime, kaseraTaxId })
    })
  }

  const onError: SubmitErrorHandler<UserRegister> = (errors) => {
    __DEV__ && console.log({ errors })
  }

  // const saveAddress = async (userId: number) => {
  //   const currentAddress = await loadString("address")
  //   if (currentAddress?.length > 0) {
  //     const address: Address = JSON.parse(currentAddress)
  //     address.userId = userId
  //     await addressStore
  //       .add(address)
  //       .then((res) => {
  //         if (res) {
  //           address.id = Number(res.data)
  //           addressStore.setCurrent({ ...address })
  //           userStore.setAddressId(address.id)
  //           userStore.updateAddresId(userId, address.id)
  //           commonStore.setIsSignedIn(true)

  //           AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
  //             [AppEventsLogger.AppEventParams.RegistrationMethod]: "email",
  //             [AppEventsLogger.AppEventParams.Currency]: "GTQ",
  //             description: "Nuevo usuario registrado con email",
  //           })
  //           AppEventsLogger.setUserID(userId.toString())

  //           RNUxcam.logEvent("register", {
  //             exploreApp: true,
  //           })
  //           mixpanel.track("Register completed", {
  //             exploreApp: false,
  //           })
  //           OneSignal.sendTag("registered", "1")
  //           navigation.navigate("checkout", { isPlan: cartStore.inRechargeProcess })
  //         }
  //       })
  //       .catch((error: Error) => {
  //         messagesStore.showError(error.message)
  //       })
  //       .finally(() => commonStore.setVisibleLoading(false))
  //   }
  // }

  const toLogin = () => {
    navigation.navigate("loginForm", { screenRedirect: "checkout" })
  }
  return (
    <>
      <Screen
        preset="fixed"
        bottomBar="light-content"
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={[styles.containerForm, utilSpacing.p5]}>
            <View>
              <TouchableOpacity onPress={goBack}>
                <Icon name="arrow-left" size={24} color={color.text}></Icon>
              </TouchableOpacity>
            </View>

            <Text
              size="lg"
              tx="registerFormScreen.title"
              style={[{ fontSize: 24 }, utilSpacing.pb6, utilSpacing.mt4]}
              preset="bold"
            ></Text>
            <FormProvider {...methods}>
              <View style={[utilFlex.flexRow, utilSpacing.mb5]}>
                <View style={[utilFlex.flex1, utilSpacing.mr3]}>
                  <InputText
                    name="name"
                    placeholderTx="registerFormScreen.firstName"
                    styleContainer={[styles.input]}
                    rules={{
                      required: "registerFormScreen.firstNameRequired",
                    }}
                    maxLength={100}
                  ></InputText>
                </View>

                <View style={[utilFlex.flex1, utilSpacing.ml3]}>
                  <InputText
                    name="lastName"
                    placeholderTx="registerFormScreen.lastName"
                    styleContainer={[styles.input]}
                    rules={{
                      required: "registerFormScreen.lastNameRequired",
                    }}
                    maxLength={100}
                  ></InputText>
                </View>
              </View>

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

              <InputText
                name="phone"
                forwardedRef={fieldPhone}
                keyboardType="phone-pad"
                placeholderTx="registerFormScreen.phone"
                styleContainer={styles.input}
                rules={{
                  required: "registerFormScreen.phoneRequired",
                  minLength: {
                    value: getMaskLength(countryStore.selectedCountry.maskPhone),
                    message:
                      userStore.countryId === GUATEMALA
                        ? "registerFormScreen.phoneFormatIncorrectGt"
                        : "registerFormScreen.phoneFormatIncorrect",
                  },
                }}
                mask={countryStore.selectedCountry.maskPhone}
                prefix={
                  <TouchableOpacity
                    activeOpacity={0}
                    onPress={() => {
                      fieldPhone?.current.focus()
                    }}
                  >
                    <Text
                      style={[utilSpacing.ml3, utilText.textGray]}
                      text={countryStore.selectedCountry.prefixPhone}
                    ></Text>
                  </TouchableOpacity>
                }
              ></InputText>

              <View style={styles.containerTermsBtn}>
                <Button
                  tx="registerFormScreen.register"
                  onPress={methods.handleSubmit(onSubmit, onError)}
                  block
                  style={[styles.btn, utilSpacing.my5]}
                ></Button>

                <View style={styles.containerTermsText}>
                  <Text
                    size="sm"
                    tx="registerFormScreen.acceptThe"
                    style={styles.lineHeight}
                  ></Text>
                  <Text
                    size="sm"
                    onPress={goTerms}
                    style={[styles.textPrimary, styles.lineHeight]}
                    tx="registerFormScreen.termsAndConditions"
                  ></Text>
                  <Text size="sm" tx="registerFormScreen.andThe" style={styles.lineHeight}></Text>
                  <Text
                    size="sm"
                    onPress={goPrivacy}
                    style={[styles.textPrimary, styles.lineHeight]}
                    tx="registerFormScreen.privacyPolicy"
                  ></Text>
                  <Text size="sm" tx="registerFormScreen.ofKasera" style={styles.lineHeight}></Text>
                </View>
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
  },
  containerForm: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
  lineHeight: {
    lineHeight: 25,
  },
  lottie: {
    height: 100,
    width: 100,
  },
  textPrimary: {
    color: color.primary,
    textDecorationLine: "underline",
  },
})
