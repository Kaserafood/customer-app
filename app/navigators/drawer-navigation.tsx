import { createDrawerNavigator } from "@react-navigation/drawer"
import React from "react"
import { color } from "../theme"
import DrawerContent from "./drawer-content"
import { TabMainNavigation } from "./tab-main-navigation"
import {View} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Drawer = createDrawerNavigator()

export default function DrawerNavigation(args) {
  const insets = useSafeAreaInsets()
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
        {(props) => (<View style={{flex: 1}}>
          <TabMainNavigation {...props} navigationRef={args.navigationRef} />
      
          </View>)}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}
