import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useLayoutEffect } from "react"
import { Image, StatusBar, StyleSheet, View } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme/color"
import { typographySize } from "../../theme/typography"
import { utilSpacing } from "../../theme/Util"

export const InitScreen: FC<StackScreenProps<NavigatorParamList, "init">> = observer(
  ({ navigation }) => {
    const toRegister = () => navigation.navigate("registerPager")
    const toLogin = () => navigation.navigate("loginForm")

    useLayoutEffect(() => {
      __DEV__ && console.log("in init screen")
      changeNavigationBarColor(color.primary, false, true)
    }, [])

    return (
      <View style={styles.root}>
        <StatusBar backgroundColor={color.primary} barStyle="light-content" />
        <Image style={styles.imageLogo} source={require("./icon-white.png")}></Image>
        <Text style={styles.textTitle} tx="initScreen.homemadeFood"></Text>
        <Text
          style={[styles.textSecondary, utilSpacing.mt5]}
          tx="initScreen.byChefIndependently"
        ></Text>
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
      </View>
    )
  },
)

const styles = StyleSheet.create({
  button: {
    fontSize: typographySize.xl,
    lineHeight: 35,
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
    backgroundColor: color.primary,
    flex: 1,
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
    lineHeight: 45,
  },
})
