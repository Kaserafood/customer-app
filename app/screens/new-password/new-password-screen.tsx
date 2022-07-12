import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import LottieView from "lottie-react-native"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Header, InputText, Loader, Modal, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError } from "../../utils/messages"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"

const modalState = new ModalStateHandler()

export const NewPasswordScreen: FC<StackScreenProps<NavigatorParamList, "newPassword">> = observer(
  ({ navigation, route: { params } }) => {
    const methods = useForm({ mode: "onBlur" })
    const { commonStore, userStore } = useStores()
    const [canRemoveScreen, setCanRemoveScreen] = useState(false)

    useEffect(() => {
      navigation.addListener("beforeRemove", (event) => {
        console.log("beforeRemove", canRemoveScreen)
        if (!canRemoveScreen) {
          event.preventDefault()
          return
        }
        navigation.dispatch(event.data.action)
      })
    }, [navigation, canRemoveScreen])

    useEffect(() => {
      if (canRemoveScreen) {
        modalState.setVisible(false)
        navigation.navigate("loginForm")
      }
    }, [canRemoveScreen])

    const onError: SubmitErrorHandler<any> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (form) => {
      if (form.password === form.passwordConfirm) {
        Keyboard.dismiss()
        commonStore.setVisibleLoading(true)
        userStore
          .changePassword(params.email, form.password)
          .then((isChanged: boolean) => {
            if (isChanged) {
              modalState.setVisible(true)
            }
          })
          .finally(() => commonStore.setVisibleLoading(false))
      } else {
        showMessageError(getI18nText("newPasswordScreen.passwordNotMatch"))
      }
    }

    const toLoginScreen = () => {
      setCanRemoveScreen(true)
    }

    return (
      <Screen style={styles.container} preset="scroll">
        <Header headerTx="newPasswordScreen.title" style={utilSpacing.pb6}></Header>

        <View style={styles.containerForm}>
          <Text
            preset="semiBold"
            tx="newPasswordScreen.info"
            style={[utilSpacing.mb8, utilSpacing.mt4]}
          ></Text>

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
        {/* <Loader></Loader> */}
        <ModalPasswordChanged
          navigation={navigation}
          toLoginScreen={toLoginScreen}
        ></ModalPasswordChanged>
      </Screen>
    )
  },
)

const ModalPasswordChanged = (props: {
  navigation: StackNavigationProp<NavigatorParamList, "newPassword">
  toLoginScreen: () => void
}) => {
  return (
    <Modal
      modal={modalState}
      styleBody={styles.w80}
      hideOnBackdropPress={false}
      isVisibleIconClose={false}
    >
      <View>
        <LottieView loop={false} style={styles.icon} source={images.resetPassword} autoPlay />
        <Text
          tx="newPasswordScreen.infoChanged"
          preset="semiBold"
          style={[utilSpacing.my4, utilFlex.selfCenter]}
        ></Text>
        <Button
          tx="newPasswordScreen.login"
          style={[
            styles.btn,
            utilSpacing.pb5,
            utilSpacing.mb4,
            utilSpacing.mt7,
            utilFlex.selfCenter,
          ]}
          onPress={() => props.toLoginScreen()}
        ></Button>
      </View>
    </Modal>
  )
}

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
  icon: {
    alignSelf: "center",
    height: 200,
  },
  input: {
    marginBottom: spacing[5],
  },
  w80: {
    width: "80%",
  },
})
