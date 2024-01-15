import * as React from "react"
import { View } from "react-native"
import { createIconSetFromIcoMoon } from "react-native-vector-icons"

import IconFeather from "react-native-vector-icons/Feather"
import IconIonicons from "react-native-vector-icons/Ionicons"
import Iconcticons from "react-native-vector-icons/Octicons"
import { IconProps } from "./icon.props"
import icoMoonConfig from "./selection.json"

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig)

export function Icon(props: IconProps) {
  const { type = "Custom", ...rest } = props

  return (
    <View>
      {type === "Custom" && <IcoMoon {...rest} />}
      {type === "Octicons" && <Iconcticons {...rest} />}
      {type === "Feather" && <IconFeather {...rest} />}
      {type === "Ionicons" && <IconIonicons {...rest} />}
    </View>
  )
}
