/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { useColorScheme } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Icon } from "../components"
import { Category } from "../models/category-store"
import { DishChef } from "../models/dish-store"
import { useStores } from "../models/root-store/root-store-context"
import {
  AddressScreen,
  CategoryScreen,
  ChefsScreen,
  DeliveryDetailScreen,
  DishDetailScreen,
  EndOrderScreen,
  HomeScreen,
  InitScreen,
  LoginFormScreen,
  MapScreen,
  MenuChefScreen,
  PrivacyPolicyScreen,
  RegisterFormScreen,
  RegisterPagerScreen,
  SearchScreen,
  TermsConditionsScreen,
} from "../screens"
import { color } from "../theme"
import { typographySize } from "../theme/typography"
import { utilSpacing } from "../theme/Util"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"

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

interface registerPageParams {
  init: boolean
}

interface addressScreenParams {
  latitude: number
  longitude: number
  addressMap: string
  latitudeDelta: number
  longitudeDelta: number
}

export type NavigatorParamList = {
  init: undefined
  registerForm: undefined
  termsConditions: undefined
  privacyPolicy: undefined
  registerPager: registerPageParams
  loginForm: undefined
  main: undefined
  dishDetail: DishChef
  menuChef: DishChef
  deliveryDetail: undefined
  endOrder: undefined
  category: Category
  home: undefined
  chefs: undefined
  search: undefined
  map: undefined
  address: addressScreenParams
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = (props: { isSigendId: boolean }) => {
  // const { commonStore } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!props.isSigendId ? (
        <>
          <Stack.Screen options={{ animation: "none" }} name="init" component={InitScreen} />
          <Stack.Screen name="registerForm" component={RegisterFormScreen} />
          <Stack.Screen name="termsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="privacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="registerPager" component={RegisterPagerScreen} />
          <Stack.Screen name="loginForm" component={LoginFormScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="main" component={TabMainNavigation} />
          <Stack.Screen name="dishDetail" component={DishDetailScreen} />
          <Stack.Screen name="menuChef" component={MenuChefScreen} />
          <Stack.Screen name="deliveryDetail" component={DeliveryDetailScreen} />
          <Stack.Screen name="endOrder" component={EndOrderScreen} />
          <Stack.Screen name="category" component={CategoryScreen} />
          <Stack.Screen name="map" component={MapScreen} />
          <Stack.Screen name="address" component={AddressScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  const { commonStore } = useStores()
  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      onReady={() => RNBootSplash.hide()}
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack isSigendId={commonStore.isSignedIn} />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

const Tab = createBottomTabNavigator()

export function TabMainNavigation() {
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
        name="Inicio"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="hat-chef" size={30} color={color} />
          },
        }}
        name="Chefs"
        component={ChefsScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <Icon style={utilSpacing.mt2} name="search" size={35} color={color} />
          },
        }}
        name="Buscar"
        component={SearchScreen}
      />

      <Tab.Screen
        options={{
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color }) => {
            return <IconRN style={utilSpacing.mt2} name="menu" light size={30} color={color} />
          },
        }}
        name="Más"
        component={SearchScreen}
      />
    </Tab.Navigator>
  )
}

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
function createDrawerNavigator() {
  throw new Error("Function not implemented.")
}

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}
