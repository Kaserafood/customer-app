import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Button, Header, InputText, Modal, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

const modalState = new ModalStateHandler()

export const RecoverPasswordScreen: FC<
  StackScreenProps<NavigatorParamList, "recoverPassword">
> = observer(({ navigation }) => {
  const { ...methods } = useForm({ mode: "onBlur" })
  const { userStore, commonStore, messagesStore } = useStores()

  useEffect(() => {
    __DEV__ && console.log("recoverPasswordScreen : useEffect")
  }, [])

  const onError: SubmitErrorHandler<any> = (errors) => {
    __DEV__ && console.log({ errors })
  }

  const onSubmit = (data: { email: string }) => {
    commonStore.setVisibleLoading(true)

    userStore
      .sendEmailRecoverPassword(data.email)
      .then((sended: boolean) => {
        sended && modalState.setVisible(true)
      })
      .catch((error: Error) => {
        messagesStore.showError(error.message)
      })
      .finally(() => commonStore.setVisibleLoading(false))
  }

  return (
    <>
      <Screen style={styles.container} preset="scroll" bottomBar="dark-content">
        <Header
          headerTx="recoverPasswordScreen.title"
          leftIcon="back"
          onLeftPress={goBack}
        ></Header>
        <View style={styles.containerForm}>
          <Text
            preset="semiBold"
            tx="recoverPasswordScreen.info"
            style={[utilSpacing.mb8, utilSpacing.mt4]}
          />

          <FormProvider {...methods}>
            <InputText
              name="email"
              keyboardType="email-address"
              placeholderTx="recoverPasswordScreen.email"
              styleContainer={utilSpacing.mb6}
              rules={{
                required: "recoverPasswordScreen.emailRequired",
                pattern: {
                  value: /\b[\w\\.+-]+@[\w\\.-]+\.\w{2,4}\b/,
                  message: "recoverPasswordScreen.emailFormatIncorrect",
                },
              }}
              maxLength={200}
            ></InputText>
            <View style={[styles.containerBtn, utilSpacing.mt9]}>
              <Button
                tx="recoverPasswordScreen.send"
                style={[styles.btn, utilSpacing.py5]}
                onPress={methods.handleSubmit(onSubmit, onError)}
              ></Button>
            </View>
          </FormProvider>
        </View>
        <ModalSendedEmail
          sendAgain={() => onSubmit({ email: methods.getValues("email") })}
          navigation={navigation}
          email={methods.getValues("email")}
        ></ModalSendedEmail>
      </Screen>
    </>
  )
})

const ModalSendedEmail = (props: {
  navigation: StackNavigationProp<NavigatorParamList, "recoverPassword">
  email: string
  sendAgain: () => void
}) => {
  const toTokenScreen = () => {
    props.navigation.navigate("recoverPasswordToken", { email: props.email })
    modalState.setVisible(false)
  }

  return (
    <Modal modal={modalState} styleBody={styles.w80}>
      <View>
        <Text
          tx="recoverPasswordScreen.ready"
          preset="bold"
          size="lg"
          style={[utilSpacing.py5, utilFlex.selfCenter]}
        ></Text>
        <Text
          tx="recoverPasswordScreen.emailSended"
          preset="semiBold"
          style={utilSpacing.my4}
        ></Text>
        <Button
          tx="common.continue"
          style={[styles.btn, utilSpacing.mt4, utilFlex.selfCenter]}
          onPress={() => toTokenScreen()}
        ></Button>

        <Ripple
          onPressIn={props.sendAgain}
          rippleOpacity={0.2}
          rippleDuration={400}
          style={[styles.btnAddressAdd, utilSpacing.mx5, utilSpacing.mb5]}
        >
          <Text
            size="md"
            preset="bold"
            style={[utilFlex.selfCenter, styles.textSendAgain]}
            tx="recoverPasswordScreen.sendAgain"
          ></Text>
        </Ripple>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: "90%",
  },
  btnAddressAdd: {
    borderRadius: 8,
    marginVertical: spacing[4],
    padding: spacing[3],
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
  textSendAgain: {
    color: color.primary,
    fontSize: 13,
  },
  w80: {
    width: "80%",
  },
})
