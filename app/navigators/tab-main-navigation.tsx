import React from "react"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerActions } from "@react-navigation/native"

import { Icon, Text } from "../components"
import { ChefsScreen, HomeScreen, SearchScreen, PlansScreen } from "../screens"
import { color, spacing, typographySize } from "../theme"
import { utilSpacing, utilText } from "../theme/Util"
import { getI18nText } from "../utils/translate"
import RNUxcam from "react-native-ux-cam"
import { View, StyleSheet } from "react-native"

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
            return <Icon style={utilSpacing.mt1} name="house" size={26} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.home")}
        component={HomeScreen}
        listeners={{
          tabPress: () => {
            RNUxcam.logEvent("tabPress", { name: "Home" })
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
            return (
              <>
                <View style={styles.badge}>
                  <Text
                    size="sm"
                    style={utilText.textWhite}
                    preset="semiBold"
                    tx="tabMainNavigation.new"
                  ></Text>
                </View>
                <Icon style={utilSpacing.mt1} name="utensils" size={26} color={color} />
              </>
            )
          },
        }}
        name={getI18nText("tabMainNavigation.packages")}
        component={PlansScreen}
        listeners={{
          tabPress: () => {
            RNUxcam.logEvent("tabPress", { name: "Packages" })
            AppEventsLogger.logEvent("tabPress", 1, {
              name: "Packages",
              description: "El usuario presionó la opción 'Paquetes' en el menu principal",
            })
          },
        }}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt1} name="hat-chef" size={26} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.chefs")}
        component={ChefsScreen}
        listeners={{
          tabPress: () => {
            RNUxcam.logEvent("tabPress", { name: "chefs" })
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
            return <Icon style={utilSpacing.mt1} name="magnifying-glass" size={26} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.search")}
        component={SearchScreen}
        listeners={{
          tabPress: () => {
            RNUxcam.logEvent("tabPress", { name: "search" })
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
            return <Icon style={utilSpacing.mt2} name="bars-1" size={26} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.more")}
        component={SearchScreen}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault()
            openDrawer()
            RNUxcam.logEvent("tabPress", { name: "more" })
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

const styles = StyleSheet.create({
  badge: {
    backgroundColor: color.palette.green,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
    top: -8,
  },
})
