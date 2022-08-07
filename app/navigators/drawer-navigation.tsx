import { createDrawerNavigator } from "@react-navigation/drawer"
import React from "react"
import { View } from "react-native"
import { color } from "../theme"
import { utilFlex } from "../theme/Util"
import DrawerContent from "./drawer-content"
import { TabMainNavigation } from "./tab-main-navigation"

const Drawer = createDrawerNavigator()

export default function DrawerNavigation(args) {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerStyle: {
          backgroundColor: color.palette.white,
        },
        overlayColor: color.modalTransparent,
        swipeEdgeWidth: 0,
        swipeEnabled: false,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="MenuDrawer">
        {(props) => (
          <View style={utilFlex.flex1}>
            <TabMainNavigation {...props} navigationRef={args.navigationRef} />
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}
