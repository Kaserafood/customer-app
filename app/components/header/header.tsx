import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { translate } from "../../i18n/"
import { color, spacing } from "../../theme"
import { typography } from "../../theme/typography"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"
import { HeaderProps } from "./header.props"

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

const BUTTON: ViewStyle = {
  backgroundColor: color.primaryDarker,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 100,
  width: 38,
  height: 38,
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,

    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={[ROOT, style, utilFlex.flexCenterHorizontal]}>
      {leftIcon ? (
        <TouchableOpacity style={BUTTON} onPress={onLeftPress} activeOpacity={0.5}>
          {leftIcon === "back" && (
            <Icon
              name="angle-left-1"
              style={utilSpacing.mr2}
              size={24}
              color={color.palette.white}
            ></Icon>
          )}
        </TouchableOpacity>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} />
      </View>

      <View style={RIGHT} />
    </View>
  )
}
