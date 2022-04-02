import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import { Screen, Text, Header, InputText, Button } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilSpacing, utilText } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
}

export const LoginFormScreen: FC<StackScreenProps<NavigatorParamList, "loginForm">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const toMain = () => navigation.navigate("main")
    return (
      <Screen style={ROOT} preset="scroll" bottomBar="light-content">
        <Header headerTx="loginFormScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <View style={styles.containerForm}>
          <Text
            preset="semiBold"
            tx="loginFormScreen.info"
            style={[utilSpacing.mb8, utilSpacing.mt4]}
          />
          <InputText
            keyboardType="email-address"
            placeholderTx="loginFormScreen.email"
            styleContainer={styles.input}
          ></InputText>

          <InputText
            placeholderTx="loginFormScreen.password"
            styleContainer={[styles.input]}
            secureTextEntry
          ></InputText>
          <View style={[styles.containerBtn, utilSpacing.mt9]}>
            <Button
              tx="loginFormScreen.continue"
              rounded
              onPress={toMain}
              style={[styles.btn, utilSpacing.py5]}
            ></Button>
          </View>
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
