import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { color, typographySize } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Button } from "../button/button"
import { ButtonProps } from "../button/button.props"

export interface ButtonFooterProps extends ButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Show border top
   */
  borderTop?: boolean

  children? : React.ReactNode
}

/**
 * Button to use on footer of screen.
 */
export const ButtonFooter = function ButtonFooter(props: ButtonFooterProps) {
  const { style, onPress, borderTop = true, children, ...rest } = props
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, borderTop && styles.bordeTop, style]}>
      <View style={[utilSpacing.mx7, utilSpacing.pb3, utilSpacing.pt5]}>
        <Button
          style={utilSpacing.py5}
          onPress={onPress}
          textStyle={styles.buttonText}
          block
          {...rest}
        ></Button>
      </View>
      {children}
      <View style={{ height: insets.bottom, backgroundColor: color.background }}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  bordeTop: { borderTopColor: color.palette.grayLight, borderTopWidth: 1 },
  buttonText: {
    fontSize: typographySize.lg,
  },
  container: {
    backgroundColor: color.background,
  },
})
