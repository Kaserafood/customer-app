import React from "react"

import { ImageURISource, View, StyleSheet } from "react-native"
import { Image, Text } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { TxKeyPath } from "../../i18n"

interface Props {
  title: TxKeyPath
  image: ImageURISource
  backgroundColorImage: string
}

const ItemBenefit = ({ title, image, backgroundColorImage }: Props) => {
  return (
    <View style={[utilFlex.flexRow, utilSpacing.mb5, utilFlex.flexCenterVertical]}>
      <View
        style={[
          utilSpacing.p3,
          utilSpacing.mr4,
          styles.containerImage,
          { backgroundColor: backgroundColorImage },
        ]}
      >
        <Image style={styles.image} source={image}></Image>
      </View>
      <View style={utilFlex.flex1}>
        <Text numberOfLines={3} preset="semiBold" tx={title}></Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerImage: {
    borderRadius: 8,
  },
  image: {
    height: 35,
    width: 35,
  },
})

export default ItemBenefit
