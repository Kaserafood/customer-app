import { TextStyle } from "react-native"

import { color, typography } from "../../theme"
import { typographySize } from "../../theme/typography"

/**
 * All text will start off looking like this.
 */
const BASE: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  fontSize: typographySize.md,
  marginBottom: -4, // it's necessary to fix the bottom margin of the text
  // lineHeight: 23,
}

export const presets = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: { ...BASE, fontFamily: typography.primaryBold } as TextStyle,

  /**
   * A semibold version of the default text.
   */
  semiBold: { ...BASE, fontFamily: typography.primarySemiBold } as TextStyle,
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets

export const fontSize = {
  /**
   * Text small font size
   */
  sm: { fontSize: typographySize.sm },

  /**
   * The medium font size.
   */
  md: { fontSize: typographySize.md },

  /**
   * Text large font size
   */
  lg: { fontSize: typographySize.lg },

  /**
   * Text large font exta large
   */
  xl: { fontSize: typographySize.xl },
}

export type TextSize = keyof typeof fontSize
