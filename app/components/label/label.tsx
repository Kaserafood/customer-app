import React from "react"
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../"
import { TxKeyPath } from "../../i18n"
import { utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"

interface Props {
  preset: "success" | "error" | "info" | "warning"
  tx?: TxKeyPath
  text?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const Label = ({ preset, style, textStyle, tx, text }: Props) => {
  const styleContainer = [styles.status, styles.bgError, utilSpacing.px5, utilSpacing.py2]

  return (
    <View
      style={[
        styleContainer,
        preset === "error" && styles.bgError,
        preset === "success" && styles.bgGreen,
        preset === "info" && styles.bgBlue,
        preset === "warning" && styles.bgAmber,
        style,
      ]}
    >
      <Text
        tx={tx}
        text={text}
        preset="semiBold"
        size="lg"
        style={[
          preset === "error" && styles.textError,
          preset === "success" && styles.textGreen,
          preset === "info" && styles.textBlue,
          preset === "warning" && styles.textAmber,
          styles.text,
          textStyle,
        ]}
      ></Text>
    </View>
  )
}

export default Label

const styles = StyleSheet.create({
  bgAmber: {
    backgroundColor: palette.amber50,
  },
  bgBlue: {
    backgroundColor: palette.blueBg,
  },
  bgError: {
    backgroundColor: palette.errorBg,
  },
  bgGreen: {
    backgroundColor: palette.greenBackground,
  },
  status: {
    borderRadius: 8,
  },
  text: {
    letterSpacing: 0.6,
  },
  textAmber: {
    color: palette.amber600,
  },
  textBlue: {
    color: palette.blue,
  },
  textError: {
    color: palette.redDark,
  },
  textGreen: {
    color: palette.green,
  },
})
