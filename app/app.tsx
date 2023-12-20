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
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { enableLatestRenderer } from "react-native-maps"
import OneSignal from "react-native-onesignal"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"

import "./utils/ignore-warnings"

import { ToggleStorybook } from "../storybook/toggle-storybook"

import RNUxcam from "react-native-ux-cam"
import { QueryClient, QueryClientProvider } from "react-query"
import { Loader, Messages, ModalCoupon } from "./components"
import { setLocaleI18n } from "./i18n"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/error/error-boundary"
import { setLocale } from "./services/api"
import { utilFlex } from "./theme/Util"
import { getInstanceMixpanel, initializeMixpanel } from "./utils/mixpanel"
import { checkNotificationPermission, trackingPermission } from "./utils/permissions"
import * as storage from "./utils/storage"
import { loadString } from "./utils/storage"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
enableLatestRenderer()
export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"
const queryClient = new QueryClient()

initializeMixpanel()
const mixpanel = getInstanceMixpanel()

function App() {
  loadString("locale").then((locale) => {
    if (locale && locale.length > 0) {
      setLocale(locale)
      setLocaleI18n(locale)
    }
  })

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
            // if (__DEV__) {
            //   OneSignal.setAppId("f93984d0-c581-4eec-ad26-c3d30c3c7835")
            // } else {
            OneSignal.setAppId("c6f16d8c-f9d4-4d3b-8f25-a1b24ac2244a")

            // }

            OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
              const { notification } = openedEvent

              if (notification.launchURL?.length > 0) Linking.openURL(notification.launchURL)

              const data: any = notification.additionalData
              if (data && data.type === "coupon") {
                rootStore?.couponModalStore.setVisible(true)
                if (data.title?.length > 0) rootStore?.couponModalStore.setTitle(data.title)
                if (data.subtitle?.length > 0)
                  rootStore?.couponModalStore.setSubtitle(data.subtitle)
                if (data.image?.length > 0) rootStore?.couponModalStore.setImage(data.image)
              }

              if (data.notification_topic != null) {
                OneSignal.addTrigger("notification_topic", data.notification_topic)
              }
            })
          }
        })

        const userId = await loadString("userId")
        if (userId && userId.length > 0) {
          if (!rootStore.commonStore.isSignedIn) {
            rootStore.commonStore.setIsSignedIn(true)
          }
        }

        RNUxcam.optIntoSchematicRecordings() // Add this line to enable iOS screen recordings

        // Register in mixpanel the url of UXCam session
        RNUxcam.addVerificationListener(async (status) => {
          if (status.success) {
            const url = await RNUxcam.urlForCurrentSession()
            if (url) {
              const urlSegments = url.split("/")
              const idSession = urlSegments.at(-1)

              mixpanel.track("UXCam: Session Recording link", {
                uxcam_session_url: url,
                uxcam_session_url_2: `https://app.uxcam.com/app/643729b042c2fb240d392cf5/sessions/list/1/${idSession}`,
              })
            }
          }
        })

        const configuration = {
          userAppKey: "1dg22cwy6m7db2l",
          enableAutomaticScreenNameTagging: true,
          enableImprovedScreenCapture: true,
          occlusions: [],
        }

        RNUxcam.startWithConfiguration(configuration)

        if (rootStore && rootStore.userStore.isTester) {
          RNUxcam.optOutOverall()
        } else {
          RNUxcam.optInOverall()
        }
      }
      verifyUser()
    }
  }

  // otherwise, we're ready to render the app
  return (
    <ToggleStorybook>
      <RootStoreProvider value={rootStore}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </RootStoreProvider>
    </ToggleStorybook>
  )
}

export default App
