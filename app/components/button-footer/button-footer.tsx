import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { color, typographySize } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { Button } from "../button/button"
import { ButtonProps } from "../button/button.props"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export interface ButtonFooterProps extends ButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Button to use on footer of screen.
 */
export const ButtonFooter = function ButtonFooter(props: ButtonFooterProps) {
  const { style, onPress, ...rest } = props
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, style]}>
      <View style={[utilSpacing.mx7, utilSpacing.pb3, utilSpacing.pt5]}>
        <Button
          style={utilSpacing.py5}
          onPress={onPress}
          textStyle={styles.buttonText}
          block
          {...rest}
        ></Button>
      </View>
      <View style={{ height: insets.bottom, backgroundColor: color.background }}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: typographySize.lg,
  },
  container: {
    backgroundColor: color.background,
    borderTopColor: color.palette.grayLigth,
    borderTopWidth: 1,
  },
})
