/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
import RNBootSplash from "react-native-bootsplash"

import { useStores } from "../models/root-store/root-store-context"
import {
  AccountScreen,
  AddressScreen,
  CategoryScreen,
  CheckoutScreen,
  DishDetailScreen,
  EndOrderScreen,
  FavoriteScreen,
  InitScreen,
  LoginFormScreen,
  MapScreen,
  MenuChefScreen,
  NewChefsScreen,
  NewPasswordScreen,
  OrderDetailScreen,
  OrdersScreen,
  PrivacyPolicyScreen,
  RecoverPasswordScreen,
  RecoverPasswordTokenScreen,
  RegisterFormScreen,
  RegisterPagerScreen,
  ReportBugScreen,
  TermsConditionsScreen,
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
  const { commonStore, userStore } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      {!commonStore.isSignedIn ? (
        <Stack.Group>
          <Stack.Screen name="init" component={InitScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {!userStore.addCard && <Stack.Screen name="map" component={MapScreen} />}
          <Stack.Screen name="main">
            {(props) => <DrawerNavigation {...props} navigationRef={navigationRef} />}
          </Stack.Screen>
          <Stack.Screen name="dishDetail" component={DishDetailScreen} />
          <Stack.Screen name="menuChef" component={MenuChefScreen} />
          <Stack.Screen name="checkout" component={CheckoutScreen} />
          <Stack.Screen name="endOrder" component={EndOrderScreen} />
          <Stack.Screen name="category" component={CategoryScreen} />
          <Stack.Screen name="map" component={MapScreen} />
          <Stack.Screen name="address" component={AddressScreen} />
          <Stack.Screen name="orders" component={OrdersScreen} />
          <Stack.Screen name="account" component={AccountScreen} />
          <Stack.Screen name="newChefs" component={NewChefsScreen} />
          <Stack.Screen name="favorite" component={FavoriteScreen} />
          <Stack.Screen name="orderDetail" component={OrderDetailScreen} />
        </Stack.Group>
      )}
      <Stack.Group navigationKey={`${commonStore.isSignedIn}`}>
        <Stack.Screen name="registerPager" component={RegisterPagerScreen} />
        <Stack.Screen name="recoverPassword" component={RecoverPasswordScreen} />
        <Stack.Screen name="recoverPasswordToken" component={RecoverPasswordTokenScreen} />
        <Stack.Screen name="newPassword" component={NewPasswordScreen} />
        <Stack.Screen name="loginForm" component={LoginFormScreen} />

        <Stack.Screen name="termsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="privacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="reportBug" component={ReportBugScreen} />
        <Stack.Screen name="registerForm" component={RegisterFormScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  useBackButtonHandler(canExit)
  const routeNameRef = useRef(null)
  const config = {
    screens: {
      category: {
        path: "categories/:id",
      },
      favorite: {
        path: "favorites",
      },
      menuChef: {
        path: "chefs/:id",
      },
      newChefs: {
        path: "chefs/new",
      },
      dishDetail: {
        path: "products/:id",
      },
    },
  }

  const linking = {
    prefixes: ["kasera://"],
    config,
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        RNBootSplash.hide()
        routeNameRef.current = navigationRef.getCurrentRoute().name
      }}
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
