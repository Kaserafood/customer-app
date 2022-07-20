import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Card, Icon, Text } from "../components"
import { useStores } from "../models"
import { color } from "../theme"
import { utilFlex, utilSpacing } from "../theme/Util"
import { clear } from "../utils/storage"

export default function DrawerContent(props) {
  const { commonStore, userStore, addressStore, cartStore } = useStores()
  const navigation = useNavigation()
  const closeSession = async () => {
    await clear()
    userStore.setUserId(undefined)
    userStore.setDisplayName(undefined)
    userStore.setAddressId(undefined)
    userStore.setEmail(undefined)
    addressStore.setCurrent(undefined)
    addressStore.setAddresses([])
    cartStore.cleanItems()
    commonStore.setIsSignedIn(false)
  }

  const order = () => {
    navigation.navigate("orders" as never)
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
      <Ripple
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.m3}
        onPressIn={closeSession}
      >
        <Card style={[utilSpacing.px4, utilSpacing.py5]}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Icon
              name="arrow-right-from-bracket"
              style={utilSpacing.mr4}
              size={30}
              color={color.palette.grayDark}
            />
            <Text tx="drawerContent.closeSession" preset="semiBold" size="md"></Text>
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
