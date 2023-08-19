import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { Location, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"

import { ScrollView } from "react-native-gesture-handler"
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
        <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={utilSpacing.px5}
          ></Location>
        </View>
        <ScrollView style={[styles.container, utilSpacing.pb6]}>
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
    height: 68,
  },
})
