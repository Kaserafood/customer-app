import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { color } from "../../theme"

import React from "react"
import { ScreenProps } from "./screen.props"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { color } from "../../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const isIos = Platform.OS === "ios"

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle, { backgroundColor: color.background }]}
      behavior={isIos ? "padding" : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <View
        style={{
          height: insets.top,
          backgroundColor: props.statusBarBackgroundColor || color.primary,
        }}
      >
        <StatusBar
          backgroundColor={props.statusBarBackgroundColor || color.primary}
          barStyle={props.statusBar || "light-content"}
        />
      </View>
      <View style={[preset.inner, style]}>{props.children}</View>
    </KeyboardAvoidingView>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <View
        style={{
          height: insets.top,
          backgroundColor: props.statusBarBackgroundColor || color.primary,
        }}
      >
        <StatusBar
          backgroundColor={props.statusBarBackgroundColor || color.primary}
          barStyle={props.statusBar || "light-content"}
        />
      </View>

      <View style={[preset.outer, backgroundStyle]}>
        <ScrollView
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || "handled"}
        >
          {props.children}
        </ScrollView>
      </View>

      <View style={{ height: insets.bottom, backgroundColor: color.background }}></View>
    </KeyboardAvoidingView>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  changeNavigationBarColor(
    props.bottomBarBackgroundColor || color.palette.white,
    props.bottomBar !== "light-content",
    true,
  )

  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
