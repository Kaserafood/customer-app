import * as React from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { color, spacing } from "../../theme"
import { utilFlex } from "../../theme/Util"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"
import { CheckboxProps } from "./checkbox.props"

const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing[1],
  alignSelf: "flex-start",
}

const LABEL: TextStyle = { paddingLeft: spacing[2] }

export function Checkbox(props: CheckboxProps) {
  const { preset = "default", rounded, style } = props
  const numberOfLines = props.multiline ? 0 : 1
  const roundedStyle: ViewStyle = {}
  if (rounded) {
    roundedStyle.borderRadius = 100
    roundedStyle.height = 19
    roundedStyle.width = 19
  }
  const rootStyle = [ROOT, utilFlex.flexCenterVertical, style]

  const onPress = props.onToggle ? () => props.onToggle && props.onToggle(!props.value) : null

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!props.onToggle}
      onPress={onPress}
      style={rootStyle}
    >
      <View>
        {props.value ? (
          <View>
            {preset === "default" && (
              <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                <IconRN name="check-box" size={30} color={color.palette.green} />
              </Animated.View>
            )}

            {preset === "tiny" && (
              <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                <IconRN name="circle-check" size={20} color={color.palette.black} />
              </Animated.View>
            )}

            {preset === "medium" && (
              <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                <Icon name="circle-check-1" size={24} color={color.palette.black} />
              </Animated.View>
            )}
          </View>
        ) : (
          <View>
            {preset === "default" && (
              <IconRN name="check-box-outline-blank" size={30} color={color.palette.green} />
            )}
            {preset === "tiny" && <Icon name="circle" size={20} color={color.palette.black} />}

            {preset === "medium" && <Icon name="circle-1" size={24} color={color.palette.black} />}
          </View>
        )}
      </View>
      <Text text={props.text} tx={props.tx} numberOfLines={numberOfLines} style={LABEL} />
    </TouchableOpacity>
  )
}
