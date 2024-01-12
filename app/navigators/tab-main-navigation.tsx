import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DrawerActions } from "@react-navigation/native"
import React, { useEffect } from "react"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Linking } from "react-native"
import * as RNLocalize from "react-native-localize"
import OneSignal from "react-native-onesignal"
import RNUxcam from "react-native-ux-cam"
import { useQuery } from "react-query"
import { Icon } from "../components"
import { setLocaleI18n } from "../i18n"
import { useStores } from "../models"
import { HomeScreen, PlansScreen, SearchScreen } from "../screens"
import { MainScreen } from "../screens/main/main-screen"
import { AccountResponse, Api, setLocale } from "../services/api"
import { color, spacing, typographySize } from "../theme"
import { utilSpacing } from "../theme/Util"
import { getInstanceMixpanel } from "../utils/mixpanel"
import { checkNotificationPermission } from "../utils/permissions"
import { formatPhone } from "../utils/string"
import { getI18nText } from "../utils/translate"

const api = new Api()
const mixpanel = getInstanceMixpanel()
export function TabMainNavigation({ navigationRef }) {
  const Tab = createBottomTabNavigator()
  const insets = useSafeAreaInsets()
  const { userStore, plansStore, messagesStore, addressStore, couponModalStore } = useStores()
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
  }

  useQuery(
    ["user", userStore.userId],
    () => api.getAccount(userStore.userId, RNLocalize.getTimeZone()),
    {
      onSuccess: (data: AccountResponse) => {
        const { currency, date, role, isGeneralRegime, kaseraTaxId, plan } = data.data

        userStore.setAccount({ currency, date, role, isGeneralRegime, kaseraTaxId })

        OneSignal.sendTag("role", role)

        plansStore.setPlan(plan)
      },
      onError: () => {
        messagesStore.showError()
      },
    },
  )

  useQuery("credit-config", () => api.getPlanConfig(), {
    onSuccess(data) {
      plansStore.setPlanConfig(data.data)
    },
    onError: (error) => {
      console.log(error)
      messagesStore.showError()
    },
  })

  useEffect(() => {
    if (userStore.countryId === 1) {
      setLocale("es")
      setLocaleI18n("es")
    } else {
      setLocale("en")
      setLocaleI18n("en")
    }
  }, [userStore.countryId])

  useEffect(() => {
    if (userStore?.email) {
      OneSignal.setEmail(userStore.email)
      OneSignal.sendTag("name", userStore.displayName)

      mixpanel.getPeople().set("$email", userStore.email)
      mixpanel.getPeople().set("$name", userStore.displayName)
      mixpanel.getPeople().set("$phone", formatPhone(userStore.phone))
    }
  }, [userStore?.email, userStore.name, userStore.lastName])

  useEffect(() => {
    if (userStore.userId > 0) OneSignal.addTrigger("logged", "true")

    if (userStore.account?.role) OneSignal.sendTag("role", userStore.account?.role)
  }, [userStore.userId, userStore.account?.role])

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
            mixpanel.track("Main navigation", { name: "Inicio" })
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
            mixpanel.track("Main navigation", { name: "Packages" })
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
            mixpanel.track("Main navigation", { name: "Chefs" })
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
            mixpanel.track("Main navigation", { name: "More options" })
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
