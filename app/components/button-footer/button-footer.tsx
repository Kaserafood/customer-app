import * as React from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import SlideButton from "rn-slide-button"
import { translate } from "../../i18n"
import { color, typographySize } from "../../theme"
import { utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { Button } from "../button/button"
import { ButtonProps } from "../button/button.props"
import { Icon } from "../icon/icon"

export interface ButtonFooterProps extends ButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Show border top
   */
  borderTop?: boolean

  /**
   * Children component
   */
  children?: React.ReactNode

  /**
   * Use slide-to-action button,
   */
  slideToAction?: boolean
}

/**
 * Button to use on footer of screen.
 */
export const ButtonFooter = function ButtonFooter(props: ButtonFooterProps) {
  const { style, onPress, borderTop = true, children, slideToAction, tx, ...rest } = props

  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, borderTop && styles.bordeTop, style]}>
      {slideToAction ? (
        <View style={utilSpacing.px5}>
          <SlideButton
            title={translate(tx)}
            containerStyle={{
              backgroundColor: palette.red,
            }}
            underlayStyle={{
              backgroundColor: palette.redAccent,
            }}
            onReachedToEnd={onPress}
            titleContainerStyle={styles.titleContainer}
            titleStyle={[utilText.bold, styles.buttonText]}
            icon={<Icon name="angles-right1" color={palette.black} size={25} />}
          />
        </View>
      ) : (
        <View style={[utilSpacing.mx7, utilSpacing.pb3, utilSpacing.pt5]}>
          <Button
            style={utilSpacing.py5}
            onPress={onPress}
            textStyle={styles.buttonText}
            block
            tx={tx}
            {...rest}
          ></Button>
        </View>
      )}

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
  titleContainer: { left: "-10%", position: "relative", width: "120%" },
})
