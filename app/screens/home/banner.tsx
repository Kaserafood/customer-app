import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import images from "../../assets/images"
import { Image } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface PropsBanner {
  onPressWelcome: () => void
}

export const Banner = (props: PropsBanner) => {
  const { onPressWelcome } = props
  return (
    <View>
      <ScrollView horizontal style={[utilFlex.flexRow, utilSpacing.mb4]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.image, utilSpacing.mr3]}
          onPress={() => onPressWelcome()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner1}></Image>
        </TouchableOpacity>

        <Image style={[styles.image, utilSpacing.mr3]} source={images.banner2}></Image>
        <Image style={[styles.image, utilSpacing.mr3]} source={images.banner3}></Image>
        <Image style={[styles.image, utilSpacing.mr3]} source={images.banner4}></Image>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  image: {
    borderRadius: 16,
    height: 160,
    width: 385,
  },
})
