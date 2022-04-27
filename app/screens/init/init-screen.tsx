import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { Image, StyleSheet, View } from "react-native"
import { Button, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme/color"
import { typographySize } from "../../theme/typography"
import { utilSpacing } from "../../theme/Util"

export const InitScreen: FC<StackScreenProps<NavigatorParamList, "init">> = observer(
  ({ navigation }) => {
    const toRegister = () => navigation.navigate("registerPager")
    const toLogin = () => navigation.navigate("loginForm")

    useEffect(() => {
      console.log("in init screen")
    }, [])

    return (
      <Screen
        statusBarBackgroundColor={color.primary}
        bottomBarBackgroundColor={color.primary}
        bottomBar="light-content"
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
            style={utilSpacing.mb6}
            block
            tx="initScreen.register"
            onPress={toRegister}
            textStyle={[styles.button]}
          ></Button>
          <Button
            preset="white"
            textStyle={[styles.button]}
            block
            tx="initScreen.login"
            onPress={toLogin}
          ></Button>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  button: {
    fontSize: typographySize.xl,
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
