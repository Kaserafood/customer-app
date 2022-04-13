import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, TextInputProps, TextInput } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { typographySize } from "../../theme/typography"

const TEXT_STYLES: TextStyle = {
  paddingHorizontal: spacing[3],
  paddingVertical: spacing[3],
  fontFamily: typography.primary,
  marginBottom: -3,
  fontSize: typographySize.md,
  color: color.text,
}
const CONTAINER: ViewStyle = {
  backgroundColor: color.palette.grayLigth,
  borderRadius: spacing[2],
}

export interface InputTextProps extends TextInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * An optional style override  the InputText style .
   */
  style?: StyleProp<TextStyle>

  /**
   * An optional style override the View container style.
   */
  styleContainer?: StyleProp<ViewStyle>

  /**
   * An optional reference
   */
  forwardedRef?: any
}

export const InputText = observer(function InputText(props: InputTextProps) {
  const { style, styleContainer, placeholder, forwardedRef, placeholderTx, ...rest } = props
  const stylesInput = Object.assign({}, TEXT_STYLES, style)
  const container = Object.assign({}, CONTAINER, styleContainer)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  return (
    <View style={container}>
      <TextInput
        selectionColor={color.palette.grayDark}
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.grayDark}
        underlineColorAndroid={color.transparent}
        {...rest}
        style={stylesInput}
        ref={forwardedRef}
      />
    </View>
  )
})
