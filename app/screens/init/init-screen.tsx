import React, { FC, useLayoutEffect, useEffect } from "react"
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { ScrollView } from "react-native-gesture-handler"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import OneSignal from "react-native-onesignal"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Button, Icon, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme/color"
import { typographySize } from "../../theme/typography"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { ModalCountry } from "./modal-country"
import { ModalStateHandler } from "../../utils/modalState"

const modalCountry = new ModalStateHandler()
export const InitScreen: FC<StackScreenProps<NavigatorParamList, "init">> = observer(
  ({ navigation }) => {
    const { userStore, commonStore, countryStore } = useStores()
    const toRegister = () => navigation.navigate("registerPager")
    const toLogin = () => navigation.navigate("loginForm", { screenRedirect: "main" })

    const setDataStore = () => {
      AppEventsLogger.logEvent("initScreenAppExplore", 1, {
        description: "Se ha presionado el botón de 'Explorar el app'",
      })
      userStore.setUserId(-1)
      OneSignal.setExternalUserId("-1")
      commonStore.setIsSignedIn(true)
    }

    useEffect(() => {
      modalCountry.setVisible(true)
    }, [])

    useEffect(() => {
      if (countryStore.countries.length > 0) userStore.setCountryId(countryStore.countries[0].id)
    }, [countryStore.countries])

    useEffect(() => {
      if (!modalCountry.isVisible) {
        changeNavigationBarColor(color.primary, false, true)
      }
    }, [modalCountry.isVisible])

    useLayoutEffect(() => {
      __DEV__ && console.log("in init screen")
      changeNavigationBarColor(color.primary, false, true)
    }, [])

    return (
      <ScrollView contentContainerStyle={styles.root}>
        <StatusBar backgroundColor={color.primary} barStyle="light-content" />
        {countryStore.selectedCountry && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.btnCountry,
              utilSpacing.px4,
              utilSpacing.py3,
              utilFlex.flexRow,
              utilFlex.flexCenterVertical,
            ]}
            onPress={() => modalCountry.setVisible(true)}
          >
            <Image
              style={[styles.flagSmall, utilSpacing.mr2]}
              source={{ uri: countryStore.selectedCountry.flag }}
            ></Image>
            <Text text={countryStore.selectedCountry.name}></Text>
            <Icon name="angle-down" size={20} style={utilSpacing.px3} color={color.text}></Icon>
          </TouchableOpacity>
        )}

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
        <ModalCountry modalState={modalCountry}></ModalCountry>
      </ScrollView>
    )
  },
)

const styles = StyleSheet.create({
  btnCountry: {
    backgroundColor: color.palette.white,
    borderRadius: 35,
    position: "absolute",
    top: 20,
  },
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
  flagSmall: {
    borderRadius: 25,
    height: 25,
    width: 25,
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
