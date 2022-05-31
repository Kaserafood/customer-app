import { DrawerContentScrollView } from "@react-navigation/drawer"
import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Card, Icon, Text } from "../components"
import { useStores } from "../models"
import { color } from "../theme"
import { utilFlex, utilSpacing } from "../theme/Util"
import { remove } from "../utils/storage"

export default function DrawerContent(props) {
  const { commonStore, userStore } = useStores()
  const closeSession = async () => {
    await remove("userId")
    await remove("displayName")
    await remove("addressId")
    commonStore.setIsSignedIn(false)
  }

  const order = () => {
    console.log("orders")
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={[styles.containerAvatar, utilFlex.flexCenter, utilFlex.selfCenter]}>
        <IconRN name="person" size={50} color={color.palette.white} />
      </View>
      <Text
        preset="bold"
        size="lg"
        text={userStore.displayName}
        style={[utilFlex.selfCenter, utilSpacing.px3, utilSpacing.my5, utilSpacing.mb6]}
      ></Text>
      <Ripple rippleOpacity={0.2} rippleDuration={400} style={utilSpacing.m3} onPressIn={order}>
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Icon name="order" style={utilSpacing.mr4} size={30} color={color.palette.grayDark} />
            <Text tx="drawerContent.myOrdres" preset="semiBold" size="lg"></Text>
          </View>
        </Card>
      </Ripple>
      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPressIn={closeSession}
      >
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <IconRN
              name="logout"
              style={utilSpacing.mr4}
              size={30}
              color={color.palette.grayDark}
            />
            <Text tx="drawerContent.closeSession" size="lg"></Text>
          </View>
        </Card>
      </Ripple>
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
