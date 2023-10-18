import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"

import { Card, Icon, Text } from "../components"
import { useStores } from "../models"
import { color } from "../theme"
import { utilFlex, utilSpacing } from "../theme/Util"
import { openWhatsApp } from "../utils/linking"

export default function DrawerContent(props) {
  const { userStore, commonStore, messagesStore } = useStores()
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

  const toReportBug = () => {
    navigation.navigate("reportBug" as never)
  }

  const toUploadInvoice = () => {
    navigation.navigate("chefInvoice" as never)
  }

  const handleSupport = async () => {
    commonStore.setVisibleLoading(true)

    await commonStore
      .getPhoneSupport()
      .catch((error: Error) => {
        messagesStore.showError(error.message)
      })
      .finally(() => {
        commonStore.setVisibleLoading(false)
      })
    openWhatsApp(commonStore.phoneNumber, "drawerContent.whatsAppMessage")
  }

  const ordersToPrepare = () => {
    navigation.navigate("ordersChef" as never)
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
            onPress={toAccount}
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
          {userStore.account?.role === "customer" && (
            <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPress={order}>
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
          )}
        </View>
      )}
      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPress={toTermsConditions}
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

      <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPress={toReportBug}>
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
        onPress={() => handleSupport()}
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

      {userStore.account?.role === "chef" && (
        <Ripple
          rippleOpacity={0.2}
          rippleDuration={400}
          style={utilSpacing.m3}
          onPress={() => ordersToPrepare()}
        >
          <Card style={[utilSpacing.px4, utilSpacing.py5]}>
            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
              <Icon
                name="hat-chef"
                style={utilSpacing.mr4}
                size={30}
                color={color.palette.grayDark}
              />
              <Text tx="drawerContent.ordersToPrepare" preset="semiBold" size="md"></Text>
            </View>
          </Card>
        </Ripple>
      )}

      {userStore.account?.role === "chef" && (
        <Ripple
          rippleOpacity={0.2}
          rippleDuration={400}
          style={utilSpacing.m3}
          onPress={() => toUploadInvoice()}
        >
          <Card style={[utilSpacing.px4, utilSpacing.py5]}>
            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
              <Icon
                name="hat-chef"
                style={utilSpacing.mr4}
                size={30}
                color={color.palette.grayDark}
              />
              <Text tx="drawerContent.uploadInvoice" preset="semiBold" size="md"></Text>
            </View>
          </Card>
        </Ripple>
      )}

      {
        // Usuario que ha ingresado como "Explora la app"
        userStore.userId === -1 && (
          <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPress={toInit}>
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
