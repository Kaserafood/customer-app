import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useLayoutEffect } from "react"
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { Button, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme/color"
import { typographySize } from "../../theme/typography"
import { utilSpacing, utilText } from "../../theme/Util"

export const InitScreen: FC<StackScreenProps<NavigatorParamList, "init">> = observer(
  ({ navigation }) => {
    const { userStore, commonStore } = useStores()
    const toRegister = () => navigation.navigate("registerPager")
    const toLogin = () => navigation.navigate("loginForm", { screenRedirect: "main" })

    const setDataStore = () => {
      userStore.setUserId(-1)
      commonStore.setIsSignedIn(true)
    }

    useLayoutEffect(() => {
      __DEV__ && console.log("in init screen")
      changeNavigationBarColor(color.primary, false, true)
    }, [])

    return (
      <ScrollView contentContainerStyle={styles.root}>
        <StatusBar backgroundColor={color.primary} barStyle="light-content" />

        <Image style={styles.imageLogo} source={require("./icon-white.png")}></Image>
        <Text style={styles.textTitle} preset="semiBold" tx="initScreen.homemadeFood"></Text>
        <Text
          style={[styles.textSecondary, utilSpacing.mt5]}
          tx="initScreen.byChefIndependently"
        ></Text>
        <View style={styles.containerButtons}>
          <Button
            preset="white"
            style={utilSpacing.mb5}
            block
            tx="initScreen.register"
            onPress={toRegister}
            textStyle={styles.button}
          ></Button>
          <Button
            preset="white"
            textStyle={styles.button}
            block
            tx="initScreen.login"
            onPress={toLogin}
          ></Button>

          <TouchableOpacity
            onPress={() => setDataStore()}
            style={[styles.btnExplore, utilSpacing.p4]}
          >
            <Text
              style={[styles.button, utilText.bold, styles.txtExplore]}
              tx="initScreen.exploreApp"
            ></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  },
)

const styles = StyleSheet.create({
  btnExplore: {
    alignSelf: "center",
    lineHeight: 35,
    marginTop: 30,
  },
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
    flexGrow: 1,
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
  txtExplore: {
    color: color.palette.white,
    fontSize: typographySize.xl,
  },
})
