import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerActions } from "@react-navigation/native"
import React from "react"
import { Icon } from "../components"
import { ChefsScreen, HomeScreen, SearchScreen } from "../screens"
import { color, typographySize } from "../theme"
import { utilSpacing } from "../theme/Util"
import { getI18nText } from "../utils/translate"

export function TabMainNavigation({ navigationRef }) {
  const Tab = createBottomTabNavigator()
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
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
          backgroundColor: color.background,
          borderTopWidth: 0,
          height: 55,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        },
      }}
    >
      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="house" size={30} color={color} />
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
            return <Icon style={utilSpacing.mt2} name="magnifying-glass" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.search")}
        component={SearchScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt3} name="bars-1" size={30} color={color} />
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
