import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import images from "../../assets/images"
import { Image } from "../../components"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface PropsBanner {
  onPressWelcome: () => void
  onPressSeasonal: () => void
  onPressNewChefs: () => void
  onPressFavorites: () => void
}

export const Banner = (props: PropsBanner) => {
  const { onPressWelcome, onPressSeasonal, onPressFavorites, onPressNewChefs } = props
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

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.image, utilSpacing.mr3]}
          onPress={() => onPressSeasonal()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner2}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.image, utilSpacing.mr3]}
          onPress={() => onPressNewChefs()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner3}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.image, utilSpacing.mr3]}
          onPress={() => onPressFavorites()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner4}></Image>
        </TouchableOpacity>
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
