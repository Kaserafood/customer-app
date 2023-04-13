import { UseControllerProps } from "react-hook-form"
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native"

import { TxKeyPath } from "../../i18n"

type presets = "normal" | "card"
export interface InputTextProps extends TextInputProps, UseControllerProps {
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
   * An optional style override  the Label style .
   */
  styleLabel?: StyleProp<TextStyle>

  /**
   * An optional style override the View container style.
   */
  styleContainer?: StyleProp<ViewStyle>

  /**
   * An optional reference
   */
  forwardedRef?: any

  /**
   * An optional label to display when preset is "card"
   */
  labelTx?: TxKeyPath

  /**
   * Name of the input
   */
  name: string

  /**
   * Default value in the input
   */
  defaultValue?: string

  /**
   * Preset style
   */
  preset?: presets

  /**
   * Mask for the input
   */
  mask?: string

  /***
   * Counter charactes of the input text, only works with preset "card"
   */
  counter?: number

  /**
   * Icon to display on the right side of the input
   */
  iconRight?: React.ReactElement

  /**
   * Required flag
   */
  required?: boolean

  /**
   * Helper text
   */
  helperText?: React.ReactElement
}
