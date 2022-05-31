import { createDrawerNavigator } from "@react-navigation/drawer"
import React from "react"
import { color } from "../theme"
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
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="MenuDrawer">
        {(props) => <TabMainNavigation {...props} navigationRef={args.navigationRef} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}
