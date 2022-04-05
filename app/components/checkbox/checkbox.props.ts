import { StyleProp, ViewStyle } from "react-native"
import { TxKeyPath } from "../../i18n"

export interface CheckboxProps {
  /**
   * Additional container style. Useful for margins.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Additional outline style.
   */
  outlineStyle?: StyleProp<ViewStyle>

  /**
   * Is the checkbox checked?
   */
  value?: boolean

  /**
   * The text to display if there isn't a tx.
   */
  text?: string

  /**
   * The i18n lookup key.
   */
  tx?: TxKeyPath

  /**
   * Multiline or clipped single line?
   */
  multiline?: boolean

  /**
   * Fires when the user tabs to change the value.
   */
  onToggle?: (newValue: boolean) => void

  /**
   * Preset checkbox, tiny is samall an black, default is big and green
   */
  preset?: "tiny" | "default"
}
