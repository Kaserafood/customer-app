/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer"
import {
  DarkTheme,
  DefaultTheme,
  DrawerActions,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import { TouchableHighlight } from "react-native-gesture-handler"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Card, Icon, Text } from "../components"
import { Category } from "../models/category-store"
import { DishChef } from "../models/dish-store"
import { useStores } from "../models/root-store/root-store-context"
import {
  AddressScreen,
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
import { CategoryScreen } from "../screens/category/category-screen"
import { color } from "../theme"
import { typographySize } from "../theme/typography"
import { utilSpacing } from "../theme/Util"
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

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    }
  },
}

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
          <Stack.Screen name="main" component={DrawerNavigation} />
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

const Tab = createBottomTabNavigator()

export function TabMainNavigation() {
  const openDrawer = () => {
    navigationRef.current.dispatch(DrawerActions.openDrawer())
    console.log("opeing")
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            openDrawer()
          },
        })}
      />
    </Tab.Navigator>
  )
}

const Drawer = createDrawerNavigator()

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerStyle: {
          backgroundColor: color.palette.white,
        },
        overlayColor: color.modalTransparent,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home1" component={TabMainNavigation} />
    </Drawer.Navigator>
  )
}

function CustomDrawerContent(props) {
  const { commonStore } = useStores()
  const closeSession = () => {
    commonStore.setIsSignedIn(false)
  }

  return (
    <DrawerContentScrollView {...props}>
      <TouchableHighlight onPressIn={closeSession}>
        <Card style={utilSpacing.p4}>
          <Text text="Cerrar sesion"></Text>
        </Card>
      </TouchableHighlight>
    </DrawerContentScrollView>
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
