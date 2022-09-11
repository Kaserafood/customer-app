import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Linking, StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Card, Icon, Text } from "../components"
import { useStores } from "../models"
import { color } from "../theme"
import { utilFlex, utilSpacing } from "../theme/Util"
import { getI18nText } from "../utils/translate"

export default function DrawerContent(props) {
  const { userStore, commonStore } = useStores()
  const navigation = useNavigation()

  const order = () => {
    navigation.navigate("orders" as never)
  }

  const toAccount = () => {
    navigation.navigate("account" as never)
  }

  const toTermsConditions = () => {
    navigation.navigate("termsConditions" as never)
  }

  const toInit = () => {
    commonStore.setIsSignedIn(false)
  }

  const openWhatsApp = () => {
    const message = getI18nText("drawerContent.whatsAppMessage")
    Linking.openURL("whatsapp://send?text=" + message + "&phone=+50245680417")
  }

  const toReportBug = () => {
    navigation.navigate("reportBug" as never)
  }

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={[styles.containerAvatar, utilSpacing.mt5, utilFlex.flexCenter, utilFlex.selfCenter]}
      >
        <Icon name="user" size={45} color={color.palette.white} />
      </View>
      <Text
        preset="bold"
        size="lg"
        text={userStore.displayName}
        style={[utilFlex.selfCenter, utilSpacing.px3, utilSpacing.my5, utilSpacing.mb6]}
      ></Text>
      {userStore.userId > 0 && (
        <View>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            style={utilSpacing.m3}
            onPressIn={toAccount}
          >
            <Card style={[utilSpacing.px4, utilSpacing.py5]}>
              <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                <Icon
                  name="circle-user"
                  style={utilSpacing.mr4}
                  size={30}
                  color={color.palette.grayDark}
                />
                <Text tx="drawerContent.myAccount" preset="semiBold" size="md"></Text>
              </View>
            </Card>
          </Ripple>
          <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPressIn={order}>
            <Card style={[utilSpacing.px4, utilSpacing.py5]}>
              <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                <Icon
                  name="pot-food"
                  style={utilSpacing.mr4}
                  size={30}
                  color={color.palette.grayDark}
                />
                <Text tx="drawerContent.myOrdres" preset="semiBold" size="md"></Text>
              </View>
            </Card>
          </Ripple>
        </View>
      )}
      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPressIn={toTermsConditions}
      >
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Icon
              name="memo-pad"
              style={utilSpacing.mr4}
              size={30}
              color={color.palette.grayDark}
            />
            <Text tx="drawerContent.termsConditions" preset="semiBold" size="md"></Text>
          </View>
        </Card>
      </Ripple>

      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPressIn={toReportBug}
      >
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Icon name="bug" style={utilSpacing.mr4} size={30} color={color.palette.grayDark} />
            <Text tx="drawerContent.bugReport" preset="semiBold" size="md"></Text>
          </View>
        </Card>
      </Ripple>

      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPressIn={openWhatsApp}
      >
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Icon
              name="whatsapp"
              style={utilSpacing.mr4}
              size={30}
              color={color.palette.grayDark}
            />
            <Text tx="drawerContent.support" preset="semiBold" size="md"></Text>
          </View>
        </Card>
      </Ripple>

      {
        // Usuario que ha ingresado como "Explora la app"
        userStore.userId == -1 && (
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            style={utilSpacing.m3}
            onPressIn={toInit}
          >
            <Card style={[utilSpacing.px4, utilSpacing.py5]}>
              <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                <Icon
                  name="user-lock"
                  style={utilSpacing.mr4}
                  size={30}
                  color={color.palette.grayDark}
                />
                <Text tx="drawerContent.loginRegister" preset="semiBold" size="md"></Text>
              </View>
            </Card>
          </Ripple>
        )
      }
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  containerAvatar: {
    backgroundColor: color.primary,
    borderRadius: 50,
    height: 75,
    width: 75,
  },
})
