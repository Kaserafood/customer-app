import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerActions } from "@react-navigation/native"
import React from "react"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Icon } from "../components"
import { ChefsScreen, HomeScreen, SearchScreen } from "../screens"
import { color, typographySize } from "../theme"
import { utilSpacing } from "../theme/Util"
import { getI18nText } from "../utils/translate"

export function TabMainNavigation({ navigationRef }) {
  const Tab = createBottomTabNavigator()
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
    console.log("opeing")
  }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: color.primary,
        tabBarInactiveTintColor: color.palette.black,
        tabBarActiveTintColor: color.primary,
        tabBarIconStyle: {},
        tabBarLabelStyle: {
          fontSize: typographySize.sm,
          color: color.palette.black,
        },
        tabBarStyle: {
          backgroundColor: color.palette.white,
          borderTopWidth: 0,
          height: 55,
        },
      }}
    >
      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="home" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.home")}
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="hat-chef" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.chefs")}
        component={ChefsScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="search" size={35} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.search")}
        component={SearchScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <IconRN style={utilSpacing.mt2} name="menu" light size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.more")}
        component={SearchScreen}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault()
            openDrawer()
          },
        })}
      />
    </Tab.Navigator>
  )
}
