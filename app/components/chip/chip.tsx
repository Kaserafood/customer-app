import * as React from "react"
import {
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { TxKeyPath } from "../../i18n/i18n"
import { SHADOW } from "../../theme/Util"
import { typographySize } from "../../theme/typography"

const CONTAINER: ViewStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[0],
  borderRadius: 100,
  alignSelf: "flex-start",
  ...SHADOW,
}

const TEXT: TextStyle = {
  fontSize: typographySize.md,
}

export interface ChipProps extends TouchableOpacityProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override the style text chip
   */
  textstyle?: StyleProp<TextStyle>

  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * If chip is active
   */
  active?: boolean
}

/**
 * Component Chip
 */
export const Chip = observer(function Chip(props: ChipProps) {
  const { style, tx, text, textstyle, active, ...rest } = props
  if (active) {
    CONTAINER.backgroundColor = color.palette.grayLigth
  } else {
    CONTAINER.backgroundColor = color.palette.white
    CONTAINER.shadowColor = color.palette.grayDark
  }
  const styles = Object.assign({}, CONTAINER, style)
  const styleText = Object.assign([], TEXT, textstyle)
  const content = <Text tx={tx} text={text} style={styleText} />
  return (
    <TouchableOpacity activeOpacity={0.5} style={styles} {...rest}>
      {content}
    </TouchableOpacity>
  )
})
