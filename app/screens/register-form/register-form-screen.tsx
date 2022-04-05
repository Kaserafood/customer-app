import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text, Header, InputText, Button, Checkbox } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"

export const RegisterFormScreen: FC<
  StackScreenProps<NavigatorParamList, "registerForm">
> = observer(({ navigation }) => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook

  const goBack = () => navigation.navigate("init")

  const goTerms = () => navigation.navigate("termsConditions")
  const goPrivacy = () => navigation.navigate("privacyPolicy")

  const [terms, setTerms] = useState(false)
  return (
    <Screen preset="scroll" style={styles.container} bottomBar="dark-content">
      <Header headerTx="registerFormScreen.title" leftIcon="back" onLeftPress={goBack} />

      <View style={styles.containerForm}>
        <Text preset="semiBold" tx="registerFormScreen.info" style={utilSpacing.mb6} />
        <InputText
          placeholderTx="registerFormScreen.name"
          styleContainer={styles.input}
        ></InputText>
        <InputText
          placeholderTx="registerFormScreen.lastName"
          styleContainer={styles.input}
        ></InputText>
        <InputText
          keyboardType="phone-pad"
          placeholderTx="registerFormScreen.phone"
          styleContainer={styles.input}
        ></InputText>
        <InputText
          keyboardType="email-address"
          placeholderTx="registerFormScreen.email"
          styleContainer={styles.input}
        ></InputText>
        <InputText
          placeholderTx="registerFormScreen.password"
          styleContainer={styles.input}
          secureTextEntry
        ></InputText>
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
      </View>
      <Button
        tx="registerFormScreen.register"
        rounded
        block
        style={[styles.btn, utilSpacing.mt5]}
      ></Button>
    </Screen>
  )
})
const styles = StyleSheet.create({
  btn: {
    width: "65%",
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
    width: "75%",
  },
  containerTerms: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: spacing[3],
  },
  containerTermsText: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  input: {
    marginBottom: spacing[5],
  },
  textPrimary: {
    color: color.primary,
  },
})
