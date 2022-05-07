import { ImageStyle, StyleProp, ViewStyle } from "react-native"

export interface IconProps {
  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * What icon to show, see Icon Explorer app or one of the links above
   */

  name?: string

  /**
   * The color of the icon
   */
  color?: string

  /**
   * Size of the icon, can also be passed as fontSize in the style object.
   */
  size?: number
}
