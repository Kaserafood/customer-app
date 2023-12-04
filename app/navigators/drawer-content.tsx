import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"

import { Card, Icon, Text } from "../components"
import { TxKeyPath } from "../i18n"
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

  const navigate = (screen: string) => {
    navigation.navigate(screen as never)
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
          <Item onPress={toAccount} icon="circle-user" text="drawerContent.myAccount"></Item>

          {userStore.account?.role === "customer" && (
            <Item onPress={order} icon="pot-food" text="drawerContent.myOrdres"></Item>
          )}
        </View>
      )}

      <Item onPress={toReportBug} icon="bug" text="drawerContent.bugReport"></Item>

      <Item onPress={handleSupport} icon="whatsapp" text="drawerContent.support"></Item>

      {userStore.isChef && (
        <Item onPress={ordersToPrepare} icon="hat-chef" text="drawerContent.ordersToPrepare"></Item>
      )}

      {userStore.isChef && (
        <Item
          onPress={toUploadInvoice}
          icon="clock-rotate-left1"
          text="drawerContent.previousOrders"
        ></Item>
      )}

      {userStore.isDriver && (
        <Item
          onPress={() => navigate("driverOrders")}
          icon="moped"
          text="drawerContent.orderDeliver"
        ></Item>
      )}

      {userStore.isDriver && (
        <Item
          onPress={() => navigate("driverOrdersHistory")}
          icon="clock-rotate-left1"
          text="drawerContent.ordersDelivered"
        ></Item>
      )}

      {
        // Usuario que ha ingresado como "Explora la app"
        userStore.userId === -1 && (
          <Item onPress={toInit} icon="user-lock" text="drawerContent.loginRegister"></Item>
        )
      }

      <Item onPress={toTermsConditions} icon="memo-pad" text="drawerContent.termsConditions"></Item>
    </DrawerContentScrollView>
  )
}

interface ItemProps {
  onPress: () => void
  icon: string
  text: TxKeyPath
}

const Item = ({ onPress, icon, text }: ItemProps) => {
  return (
    <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPress={onPress}>
      <Card style={[utilSpacing.px4, utilSpacing.py5]}>
        <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
          <Icon name={icon} style={utilSpacing.mr4} size={30} color={color.palette.grayDark} />
          <Text tx={text} preset="semiBold" size="md"></Text>
        </View>
      </Card>
    </Ripple>
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
