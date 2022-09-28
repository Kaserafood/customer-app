import { observer } from "mobx-react-lite"
import * as React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"

/**
 * Component to show any messages, such as errors, info, actions success,etc...
 */
export const Messages = observer(function Messages() {
  const { messagesStore } = useStores()
  return (
    <View style={styles.container}>
      {messagesStore.isVisibleSuccess && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <View
            style={[
              utilFlex.flexCenterVertical,
              utilSpacing.p4,
              utilFlex.selfCenter,
              styles.message,
            ]}
          >
            <Icon name="circle-check-1" size={24} color={color.palette.green}></Icon>
            <Text
              size="lg"
              preset="semiBold"
              style={[styles.textWhite, utilFlex.flex1, utilSpacing.px4]}
              text={messagesStore.text}
            ></Text>
            <TouchableOpacity
              onPress={() => messagesStore.setVisibleSuccess(false)}
              activeOpacity={1}
              style={[utilSpacing.py2, utilSpacing.px3]}
            >
              <Icon name="circle-xmark" size={24} color={color.palette.white}></Icon>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {messagesStore.isVisibleError && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <View
            style={[
              utilFlex.flexCenterVertical,
              utilSpacing.p4,
              utilFlex.selfCenter,
              styles.message,
            ]}
          >
            <Icon name="circle-exclamation" size={24} color={color.palette.red}></Icon>
            <Text
              size="lg"
              preset="semiBold"
              style={[styles.textWhite, utilFlex.flex1, utilSpacing.px4]}
              text={messagesStore.text}
            ></Text>
            <TouchableOpacity
              onPress={() => messagesStore.setVisibleError(false)}
              activeOpacity={1}
              style={[utilSpacing.py2, utilSpacing.px3]}
            >
              <Icon name="circle-xmark" size={24} color={color.palette.white}></Icon>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {messagesStore.isVisibleInfo && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <View
            style={[
              utilFlex.flexCenterVertical,
              utilSpacing.p4,
              utilFlex.selfCenter,
              styles.message,
            ]}
          >
            <Icon name="circle-info" size={24} color={color.palette.orange}></Icon>
            <Text
              size="lg"
              preset="semiBold"
              style={[styles.textWhite, utilFlex.flex1, utilSpacing.px4]}
              text={messagesStore.text}
            ></Text>
            <TouchableOpacity
              onPress={() => messagesStore.setVisibleInfo(false)}
              activeOpacity={1}
              style={[utilSpacing.py2, utilSpacing.px3]}
            >
              <Icon name="circle-xmark" size={24} color={color.palette.white}></Icon>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: "absolute",
    width: "100%",
    zIndex: 100,
  },
  message: {
    backgroundColor: color.palette.black,
    borderRadius: spacing[2],
    minWidth: 300,
    top: 80,
    width: "85%",
  },
  textWhite: {
    color: color.palette.white,
  },
})
