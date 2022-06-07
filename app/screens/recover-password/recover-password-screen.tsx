import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Button, Header, InputText, Modal, Screen, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState, ModalStateHandler } from "../../utils/modalState"

const modalState = new ModalStateHandler()

export const RecoverPasswordScreen: FC<
  StackScreenProps<NavigatorParamList, "recoverPassword">
> = observer(({ navigation }) => {
  const { ...methods } = useForm({ mode: "onBlur" })

  useEffect(() => {
    console.log("recoverPasswordScreen : useEffect")
  }, [])

  const onError: SubmitErrorHandler<any> = (errors) => {
    return console.log({ errors })
  }

  const onSubmit = (data: { email: string }) => {
    // commonStore.setVisibleLoading(true)
    modalState.setVisible(true)

    // userStore
    //   .login(data)
    //   .then((userValid: boolean) => {
    //     commonStore.setVisibleLoading(false)
    //     if (userValid) commonStore.setIsSignedIn(true)
    //   })
    //   .catch(() => commonStore.setVisibleLoading(false))
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
              defaultValue={"cunquero.carlos@gmail.com"}
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
      </Screen>
      <ModalSendedEmail navigation={navigation}></ModalSendedEmail>
    </>
  )
})

const ModalSendedEmail = (props: {
  navigation: StackNavigationProp<NavigatorParamList, "recoverPassword">
}) => {
  const toTokenScreen = () => {
    props.navigation.navigate("recoverPasswordToken")
    modalState.setVisible(false)
  }

  return (
    <Modal modal={modalState}>
      <View>
        <Text
          tx="recoverPasswordScreen.ready"
          preset="bold"
          size="lg"
          style={[utilSpacing.mb4, utilFlex.selfCenter]}
        ></Text>
        <Text
          tx="recoverPasswordScreen.emailSended"
          preset="semiBold"
          style={utilSpacing.mb4}
        ></Text>
        <Ripple
          rippleOpacity={0.2}
          rippleDuration={400}
          style={[styles.btnAddressAdd, utilSpacing.mx5, utilSpacing.mb5]}
        >
          <Text
            preset="semiBold"
            style={utilFlex.selfCenter}
            tx="recoverPasswordScreen.sendAgain"
          ></Text>
        </Ripple>

        <Button
          tx="common.continue"
          style={[styles.btn, utilSpacing.py5, utilSpacing.mt4, utilFlex.selfCenter]}
          onPress={() => toTokenScreen()}
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: "90%",
  },
  btnAddressAdd: {
    borderColor: color.palette.grayLigth,
    borderRadius: 8,
    borderWidth: 1,
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
})
