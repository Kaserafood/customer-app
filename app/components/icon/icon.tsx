import * as React from "react"
import { View } from "react-native"
import { createIconSetFromIcoMoon } from "react-native-vector-icons"

import { IconProps } from "./icon.props"
import icoMoonConfig from "./selection.json"

const IcoMoon = createIconSetFromIcoMoon(icoMoonConfig)

export function Icon(props: IconProps) {
  const { ...rest } = props

  return (
    <View>
      <IcoMoon {...rest} />
    </View>
  )
}
