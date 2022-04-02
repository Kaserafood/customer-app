import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Screen, Text } from "../../components"
import { color } from "../../theme/color"

export const InitScreen: FC<StackScreenProps<NavigatorParamList, "init">> = observer(
  ({ navigation }) => {
    const toRegister = () => navigation.navigate("registerPager")
    const toLogin = () => navigation.navigate("loginForm")
    return (
      <Screen
        statusBarBackgroundColor={color.primary}
        bottomBarBackgroundColor={color.primary}
        bottomBar="dark-content"
        backgroundColor={color.primary}
        preset="fixed"
        statusBar="light-content"
        style={styles.root}
      >
        <Image style={styles.imageLogo} source={require("./icon-white.png")}></Image>
        <Text style={styles.textTitle} tx="initScreen.homemadeFood"></Text>
        <Text style={styles.textSecondary} tx="initScreen.byChefIndependently"></Text>
        <View style={styles.containerButtons}>
          <Button
            preset="white"
            style={styles.buttonRegister}
            rounded
            block
            tx="initScreen.register"
            onPress={toRegister}
          ></Button>
          <Button preset="white" block rounded tx="initScreen.login" onPress={toLogin}></Button>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  buttonRegister: {
    marginBottom: 35,
  },
  containerButtons: {
    width: "60%",
  },
  imageLogo: {
    height: 230,
    width: 230,
  },
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  textSecondary: {
    color: color.palette.white,
    fontSize: 20,
    marginBottom: 70,
  },
  textTitle: {
    color: color.palette.white,
    fontSize: 35,
  },
})
