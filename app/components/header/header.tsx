import React from "react"
import { View, ViewStyle, TextStyle, StyleSheet } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"

import { color, spacing } from "../../theme"
import { translate } from "../../i18n/"
import { typography } from "../../theme/typography"
import images from "../../assets/images"
import { AutoImage } from "../auto-image/auto-image"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[2],
  alignItems: "center",
  paddingTop: spacing[4],
  paddingBottom: spacing[4],
  justifyContent: "flex-start",
  backgroundColor: color.primary,
}
const TITLE: TextStyle = {
  textAlign: "center",
  color: color.palette.white,
  fontFamily: typography.primaryBold,
  marginBottom: -spacing[1],
  fontSize: 22,
}
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={[ROOT, style]}>
      {leftIcon ? (
        <Button preset="link" rounded onPress={onLeftPress}>
          {leftIcon === "back" && <AutoImage style={styles.icon} source={images.back} />}
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} />
      </View>
      {rightIcon ? (
        <Button preset="link" rounded onPress={onRightPress}>
          {rightIcon === "back" && <AutoImage style={styles.icon} source={images.back} />}
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    marginRight: 2,
    width: 24,
  },
})
