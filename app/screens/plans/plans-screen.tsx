import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { Icon, Location, Screen, Text } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import RNUxcam from "react-native-ux-cam"
import { ModalLocation } from "../../components/location/modal-location"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import Banner from "./banner"
import Benefits from "./benefits"
import Menu from "./menu"

const modalStateLocation = new ModalStateHandler()

export const PlansScreen: FC<StackScreenProps<NavigatorParamList, "plans">> = observer(
  function PlansScreen() {
    useEffect(() => {
      RNUxcam.tagScreenName("plans")
    }, [])

    return (
      <Screen preset="fixed" style={styles.container}>
        <ScrollView style={[styles.container, utilSpacing.pb6]}>
          <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
            <TouchableOpacity
              style={[styles.btnBack, utilSpacing.ml5, utilSpacing.mr3]}
              onPress={goBack}
              activeOpacity={0.5}
            >
              <Icon
                name="angle-left-1"
                style={utilSpacing.mr2}
                size={24}
                color={color.palette.white}
              ></Icon>
            </TouchableOpacity>
            <Location
              onPress={() => {
                modalStateLocation.setVisible(true)
              }}
              style={utilSpacing.pr5}
            ></Location>
          </View>
          <Banner variant="light"></Banner>
          <Benefits></Benefits>
          <Menu></Menu>
          <Text
            tx="mainScreen.priceLunch"
            preset="semiBold"
            style={[utilSpacing.pb5, utilFlex.selfCenter]}
          ></Text>

          <Banner variant="dark"></Banner>
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btnBack: {
    alignItems: "center",
    backgroundColor: color.primaryDarker,
    borderRadius: 100,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  container: {
    backgroundColor: color.background,
  },
  containerLocation: {
    backgroundColor: color.primary,
  },
})
