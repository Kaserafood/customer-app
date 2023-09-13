import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerActions } from "@react-navigation/native"
import React, { useEffect } from "react"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import * as RNLocalize from "react-native-localize"
import RNUxcam from "react-native-ux-cam"
import { useQuery } from "react-query"
import { Icon } from "../components"
import { useStores } from "../models"
import { HomeScreen, PlansScreen, SearchScreen } from "../screens"
import { MainScreen } from "../screens/main/main-screen"
import { Api, setLocale } from "../services/api"
import { color, spacing, typographySize } from "../theme"
import { utilSpacing } from "../theme/Util"
import { getI18nText } from "../utils/translate"
import { setLocaleI18n } from "../i18n"

const api = new Api()
export function TabMainNavigation({ navigationRef }) {
  const Tab = createBottomTabNavigator()
  const insets = useSafeAreaInsets()
  const { userStore, plansStore } = useStores()
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
  }

  useQuery(
    ["user", userStore.userId],
    () => api.getAccount(userStore.userId, RNLocalize.getTimeZone()),
    {
      onSuccess: (data: any) => {
        const { currency, date } = data.data

        userStore.setAccount({ currency, date })
        plansStore.setPlan(data.data.plan)
      },
      enabled: userStore.userId > 0,
    },
  )
  useEffect(() => {
    if (userStore.countryId === 1) {
      setLocale("es")
      setLocaleI18n("es")
    } else {
      setLocale("en")
      setLocaleI18n("en")
    }
  }, [userStore.countryId])

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
        component={MainScreen}
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
                {/* <View style={styles.badge}>
                  <Text
                    size="sm"
                    style={utilText.textWhite}
                    preset="semiBold"
                    tx="tabMainNavigation.new"
                  ></Text>
                </View> */}
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
            return <Icon style={utilSpacing.mt1} name="Asset-8" size={26} color={color} />
          },
        }}
        name={getI18nText("tabMainNavigation.dishes")}
        component={HomeScreen}
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
      {/* 
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
      /> */}

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

// const styles = StyleSheet.create({
//   badge: {
//     backgroundColor: color.palette.green,
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     position: "absolute",
//     top: -8,
//   },
// })
