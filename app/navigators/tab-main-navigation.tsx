import { ChefsScreen, HomeScreen, SearchScreen } from "../screens"
import { color, spacing, typographySize } from "../theme"

import { AppEventsLogger } from "react-native-fbsdk-next"
import { DrawerActions } from "@react-navigation/native"
import { Icon } from "../components"
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { getI18nText } from "../utils/translate"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { utilSpacing } from "../theme/Util"

export function TabMainNavigation({ navigationRef }) {
  const Tab = createBottomTabNavigator()
  const insets = useSafeAreaInsets()
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
  }
  return (
    <Tab.Navigator
      screenOptions={{

        headerShown: false,
        headerTintColor: color.primary,
        tabBarInactiveTintColor: color.text,
        tabBarActiveTintColor: color.primary,
        tabBarIconStyle: {},
        tabBarLabelStyle: {
          fontSize: typographySize.sm,
          color: color.text,
          paddingBottom: spacing[1],
        },

        tabBarStyle: {
          backgroundColor: color.palette.white,
          borderTopWidth: 0,
          height: 63 + insets.bottom,
          shadowColor: color.text,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.5,
          shadowRadius: 4.65,

          elevation: 9,
        },
      }}
    >
      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt1} name="house" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.home")}
        component={HomeScreen}
        listeners={{
          tabPress: () => {
            AppEventsLogger.logEvent("tabPress", 1, {
              name: "Home",
              description: "El usuario presionó la opción 'Home' en el menu principal",
            })
          },
        }}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt1} name="hat-chef" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.chefs")}
        component={ChefsScreen}
        listeners={{
          tabPress: () => {
            AppEventsLogger.logEvent("tabPress", 1, {
              name: "chefs",
              description: "El usuario presionó la opción 'chefs' en el menú principal",
            })
          },
        }}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt1} name="magnifying-glass" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.search")}
        component={SearchScreen}
        listeners={{
          tabPress: () => {
            AppEventsLogger.logEvent("tabPress", 1, {
              name: "search",
              description: "El usuario presionó la opción 'buscar' en el menú principal",
            })
          },
        }}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="bars-1" size={30} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.more")}
        component={SearchScreen}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault()
            openDrawer()
            AppEventsLogger.logEvent("tabPress", 1, {
              name: "more",
              description: "El usuario presionó la opción 'más' en el menú principal",
            })
          },
        })}
      />
    </Tab.Navigator>
  )
}
