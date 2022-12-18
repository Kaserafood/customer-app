import { TextStyle, ViewStyle } from "react-native"

import { color, spacing } from "../../theme"
import { typography, typographySize } from "../../theme/typography"
import { NO_SHADOW } from "../../theme/Util"

const BASE_VIEW: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  borderRadius: spacing[2],
  justifyContent: "center",
  alignItems: "center",
  minWidth: 175,
  shadowColor: color.palette.grayDark,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: spacing[3],
  fontSize: typographySize.lg,
  fontFamily: typography.primaryBold,
  marginBottom: -4,
  lineHeight: 26,
}

export const viewPresets: Record<string, ViewStyle> = {
  /**
   * Button primary background.
   */
  primary: { ...BASE_VIEW, backgroundColor: color.palette.red } as ViewStyle,

  /**
   * Button white background.
   */
  white: { ...BASE_VIEW, backgroundColor: color.palette.white } as ViewStyle,

  /**
   * Button gray background.
   */
  gray: { ...BASE_VIEW, backgroundColor: color.palette.grayLigth } as ViewStyle,

  /**
   * Like a link.
   */
  link: {
    ...BASE_VIEW,
    ...NO_SHADOW,
    backgroundColor: color.palette.redDark,
    borderRadius: 100,
  } as ViewStyle,
}

export const textPresets: Record<ButtonPresetNames, TextStyle> = {
  primary: { ...BASE_TEXT, color: color.palette.white } as TextStyle,

  white: { ...BASE_TEXT, color: color.palette.black } as TextStyle,

  gray: { ...BASE_TEXT, color: color.palette.black } as TextStyle,

  link: {
    ...BASE_TEXT,
    color: color.primary,
    fontSize: 16,
    fontFamily: typography.primary,
    width: 300,
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
