import React from "react"
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import images from "../../assets/images"
import { Icon, Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface PropsBanner {
  onPressWelcome: () => void
  onPressSeasonal: () => void
  onPressNewChefs: () => void
  onPressFavorites: () => void
}
const windowWidth = Dimensions.get("window").width

export const Banner = (props: PropsBanner) => {
  const { onPressWelcome, onPressSeasonal, onPressFavorites, onPressNewChefs } = props
  return (
    <View>
      <ScrollView horizontal style={[utilFlex.flexRow, utilSpacing.mb4]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3, utilSpacing.ml4]}
          onPress={() => onPressWelcome()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner1}></Image>
          <View style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter]}>
            <Text
              preset="semiBold"
              style={[styles.title, styles.textWhite, { fontSize: 25, lineHeight: 35 }]}
              tx="banner.welcome"
            ></Text>
            <Text
              preset="bold"
              style={[styles.name, styles.textWhite, { lineHeight: 55 }]}
              tx="banner.kasera"
            ></Text>
            <Button onPress={onPressWelcome} tx="banner.whatIsIt"></Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={onPressSeasonal}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner2}></Image>

          <View
            style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter, utilFlex.flexRow]}
          >
            <View style={[utilFlex.flex1, utilSpacing.mx4]}>
              <Text
                preset="bold"
                style={[styles.title, styles.textWhite]}
                tx="banner.seasonal"
              ></Text>
              <Text
                preset="semiBold"
                style={[styles.description, styles.textWhite, utilSpacing.mt2]}
                tx="banner.seasonalDescription"
              ></Text>
              <Button onPress={onPressSeasonal} tx="banner.explore"></Button>
            </View>
            <View style={styles.containerProduct}>
              <Image style={[styles.product]} source={images.bannerImage1}></Image>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={onPressNewChefs}
        >
          <Image style={[styles.image, { left: 0, top: -20 }]} source={images.banner3}></Image>
          <View style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter]}>
            <Text
              preset="semiBold"
              style={[styles.description, styles.textWhite]}
              tx="banner.tryNewFlavors"
            ></Text>
            <Text
              preset="bold"
              style={[styles.title, styles.textWhite, utilSpacing.mt3]}
              tx="banner.newChefs"
            ></Text>

            <Button onPress={onPressNewChefs} tx="banner.toKnow"></Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={() => onPressFavorites()}
        >
          <Image style={[styles.image, utilSpacing.mr3]} source={images.banner4}></Image>

          <View
            style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter, utilFlex.flexRow]}
          >
            <View style={[utilFlex.flex1, utilSpacing.mx4]}>
              <Text
                preset="bold"
                style={[styles.title, styles.textWhite]}
                tx="banner.kaseraFavorites"
              ></Text>
              <Text
                preset="semiBold"
                style={[styles.description, styles.textWhite, utilSpacing.mt3]}
                tx="banner.kaseraFavoritesDescription"
              ></Text>
              <Button onPress={onPressFavorites} tx="banner.discover"></Button>
            </View>

            <View style={styles.containerProduct}>
              <Image style={[styles.product, { left: 0 }]} source={images.bannerImage2}></Image>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const Button = ({ onPress, tx }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        utilFlex.selfCenter,
        styles.button,
        utilSpacing.px6,
        utilSpacing.py3,
        utilSpacing.mt3,
      ]}
      onPress={onPress}
    >
      <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
        <Text tx={tx} preset="bold" style={utilSpacing.mr3}></Text>
        <Icon name="caret-right" size={17} color={color.text}></Icon>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  containerImage: {
    borderRadius: 16,
    height: 165,
    width: windowWidth - 50,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    left: -20,
    top: -3,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 16,
  },
  containerText: {
    zIndex: 2,
    position: "relative",
  },
  title: {
    fontSize: 22,
    lineHeight: 29,
  },
  name: {
    fontSize: 45,
  },
  textWhite: {
    color: color.palette.white,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
  },
  product: {
    left: -35,
    top: 0,
    right: 0,
    bottom: 0,
    width: 180,
    height: "100%",
    position: "absolute",
  },
  containerProduct: {
    width: "38%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  button: {
    borderRadius: spacing[5],
    backgroundColor: color.palette.white,
  },
})
