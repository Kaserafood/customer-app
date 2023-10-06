import { StyleProp, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native"

import { TxKeyPath } from "../../i18n"

import { ButtonPresetNames } from "./button.presets"

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode

  /**
   * Rounded borders for the button
   */
  rounded?: boolean

  /**
   * Block styling for the button
   */
  block?: boolean

  /**
   * Disabled styling for the button
   */
  disabled?: boolean

  /**
   * Icon to display on the left of the button
   */
  iconLeft?: React.ReactNode
  /**
   * Icon to display on the right of the button
   */
  iconRight?: React.ReactNode

  /**
   * Size of the button
   */
  size?: "sm" | "md"
}
