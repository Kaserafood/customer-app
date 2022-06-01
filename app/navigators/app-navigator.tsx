/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import { useStores } from "../models/root-store/root-store-context"
import {
  AddressScreen,
  DeliveryDetailScreen,
  DishDetailScreen,
  EndOrderScreen,
  InitScreen,
  LoginFormScreen,
  MapScreen,
  MenuChefScreen,
  PrivacyPolicyScreen,
  RegisterFormScreen,
  RegisterPagerScreen,
  TermsConditionsScreen,
  CategoryScreen,
  OrdersScreen,
} from "../screens"
import DrawerNavigation from "./drawer-navigation"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { NavigatorParamList } from "./navigator-param-list"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = observer(() => {
  const { commonStore } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      {!commonStore.isSignedIn ? (
        <>
          <Stack.Screen name="init" component={InitScreen} />
          <Stack.Screen name="registerForm" component={RegisterFormScreen} />
          <Stack.Screen name="termsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="privacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="registerPager" component={RegisterPagerScreen} />
          <Stack.Screen name="loginForm" component={LoginFormScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="main">
            {(props) => <DrawerNavigation {...props} navigationRef={navigationRef} />}
          </Stack.Screen>
          <Stack.Screen name="dishDetail" component={DishDetailScreen} />
          <Stack.Screen name="menuChef" component={MenuChefScreen} />
          <Stack.Screen name="deliveryDetail" component={DeliveryDetailScreen} />
          <Stack.Screen name="endOrder" component={EndOrderScreen} />
          <Stack.Screen name="category" component={CategoryScreen} />
          <Stack.Screen name="map" component={MapScreen} />
          <Stack.Screen name="address" component={AddressScreen} />
          <Stack.Screen name="orders" component={OrdersScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      onReady={() => RNBootSplash.hide()}
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
