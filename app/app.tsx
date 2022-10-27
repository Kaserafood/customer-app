/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import React, { useEffect, useState } from "react"
import { Linking } from "react-native"
import Config from "react-native-config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { enableLatestRenderer } from "react-native-maps"
import OneSignal from "react-native-onesignal"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { ToggleStorybook } from "../storybook/toggle-storybook"
import { Loader, Messages, ModalCoupon } from "./components"
import "./i18n"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/error/error-boundary"
import { utilFlex } from "./theme/Util"
import "./utils/ignore-warnings"
import { checkNotificationPermission, trackingPermission } from "./utils/permissions"
import * as storage from "./utils/storage"
import { loadString } from "./utils/storage"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableLatestRenderer()
export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

function App() {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ;(async () => {
      setupRootStore()
        .then(setRootStore)
        .catch((error) => {
          __DEV__ && console.log("FATAL ERROR APP: -> useEffect: ", error)
        })
      trackingPermission()
    })()
    return () => {
      OneSignal.clearHandlers()
    }
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rootStore || !isNavigationStateRestored) {
    return null
  } else {
    if (rootStore) {
      async function verifyUser() {
        checkNotificationPermission().then((result) => {
          if (result) {
            OneSignal.setAppId(Config.ONE_SIGNAL_APP_ID)
            OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
              const { notification } = openedEvent

              if (notification.launchURL?.length > 0) Linking.openURL(notification.launchURL)

              const data: any = notification.additionalData
              if (data.type === "coupon") {
                rootStore?.couponModalStore.setVisible(true)
                if (data.title?.length > 0) rootStore?.couponModalStore.setTitle(data.title)
                if (data.subtitle?.length > 0)
                  rootStore?.couponModalStore.setSubtitle(data.subtitle)
                if (data.image?.length > 0) rootStore?.couponModalStore.setImage(data.image)

                console.log("Coupon Modal Opened", rootStore?.couponModalStore)
              }
            })
          }
        })

        const userId = await loadString("userId")
        // rootStore.couponModalStore.setVisible(true)
        // rootStore.couponModalStore.setTitle("Obtén un 20% de descuento usando el cupón EAT21")
        // rootStore.couponModalStore.setSubtitle("Válido hasta el 31 de diciembre de 2021")
        // rootStore.couponModalStore.setImage(
        //   "https://cdn-icons-png.flaticon.com/512/2349/2349820.png",
        // )
        if (userId && userId.length > 0) {
          if (!rootStore.commonStore.isSignedIn) {
            console.log("USER LOGIN")
            rootStore.commonStore.setIsSignedIn(true)
          }
        }
      }
      verifyUser()
    }
  }

  // otherwise, we're ready to render the app
  return (
    <ToggleStorybook>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ErrorBoundary catchErrors={"always"}>
            <GestureHandlerRootView style={utilFlex.flex1}>
              <AppNavigator
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
              <Loader></Loader>
              <ModalCoupon></ModalCoupon>
            </GestureHandlerRootView>
            <Messages></Messages>
          </ErrorBoundary>
        </SafeAreaProvider>
      </RootStoreProvider>
    </ToggleStorybook>
  )
}

export default App
