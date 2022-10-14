/* eslint-disable react-native/no-inline-styles */
import React from "react"
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { ScrollView } from "react-native-gesture-handler"
import images from "../../assets/images"
import { Icon, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
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

  const onPressWelcomeBanner = () => {
    AppEventsLogger.logEvent("BannerPress", 1, {
      banner: "Welcome",
      description: "El usuario presionó el banner de 'Bienvenido'",
    })
    onPressWelcome()
  }

  const onPressSeasonalBanner = () => {
    AppEventsLogger.logEvent("BannerPress", 1, {
      banner: "Seasonal",
      description: "El usuario presionó el banner 'De temporada'",
    })
    onPressSeasonal()
  }

  const onPressFavoritesBanner = () => {
    AppEventsLogger.logEvent("BannerPress", 1, {
      banner: "Favorites",
      description: "El usuario presionó el banner 'Favoritos'",
    })
    onPressFavorites()
  }

  const onPressNewChefsBanner = () => {
    AppEventsLogger.logEvent("BannerPress", 1, {
      banner: "New Chefs",
      description: "El usuario presionó el banner 'Nuevos chefs'",
    })
    onPressNewChefs()
  }

  return (
    <View>
      <ScrollView horizontal style={[utilFlex.flexRow, utilSpacing.mb4]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3, utilSpacing.ml4]}
          onPress={onPressWelcomeBanner}
        >
          <Image
            style={[styles.image, utilSpacing.mr3, { left: -33 }]}
            source={images.banner1}
          ></Image>
          <View style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter]}>
            <Text
              preset="semiBold"
              style={[styles.title, styles.textWhite, { fontSize: 25, lineHeight: 35 }]}
              tx="banner.welcome"
            ></Text>
            <Text
              preset="bold"
              style={[styles.name, styles.textWhite, { lineHeight: 60 }]}
              tx="banner.kasera"
            ></Text>
            <Button onPress={onPressWelcomeBanner} tx="banner.whatIsIt"></Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={onPressSeasonalBanner}
        >
          <Image style={[styles.image, utilSpacing.mr3, {}]} source={images.banner2}></Image>

          <Image style={styles.flower} source={images.flowers}></Image>

          <Image source={images.calabaza} style={styles.calabaza}></Image>
          <View
            style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter, utilFlex.flexRow]}
          >
            <View style={[utilFlex.flex1, utilSpacing.mx4]}>
              <Text
                preset="bold"
                style={[styles.title, styles.textWhite, utilFlex.selfCenter, utilSpacing.mb1]}
                tx="banner.seasonal"
              ></Text>
              <Text
                preset="semiBold"
                style={[styles.description, styles.textWhite, utilSpacing.mt2, utilFlex.selfCenter]}
                tx="banner.seasonalDescription"
              ></Text>
              <Button onPress={onPressSeasonalBanner} tx="banner.explore"></Button>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={onPressNewChefsBanner}
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

            <Button onPress={onPressNewChefsBanner} tx="banner.toKnow"></Button>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.containerImage, utilSpacing.mr3]}
          onPress={onPressFavoritesBanner}
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
              <Button onPress={onPressFavoritesBanner} tx="banner.discover"></Button>
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
        utilSpacing.mt4,
      ]}
      onPress={onPress}
    >
      <View style={[utilFlex.flexRow, utilFlex.flexCenter]}>
        <Text tx={tx} preset="bold" style={utilSpacing.mr3}></Text>
        <Icon
          name="caret-right"
          size={17}
          color={color.text}
          style={Platform.OS === "ios" && { paddingTop: 3 }}
        ></Icon>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[5],
  },
  calabaza: {
    bottom: 10,
    height: 100,
    left: 10,
    position: "absolute",
    width: 250,
    zIndex: 3,
  },
  containerImage: {
    borderRadius: 16,
    height: 165,
    overflow: "hidden",
    width: windowWidth - 75,
  },
  containerProduct: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "38%",
  },
  containerText: {
    position: "relative",
    zIndex: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
  },
  flower: {
    height: 45,
    position: "absolute",
    right: 10,
    top: 10,
    width: 45,
    zIndex: 3,
  },
  image: {
    borderRadius: 24,
    bottom: 0,
    position: "absolute",
    right: -50,
    top: 0,
    zIndex: 1,
  },
  name: {
    fontFamily: typography.brand,
    fontSize: 45,
  },
  product: {
    bottom: 0,
    height: "100%",
    left: -35,
    position: "absolute",
    right: 0,
    top: 0,
    width: 180,
  },
  textWhite: {
    color: color.palette.white,
  },
  title: {
    fontSize: 22,
    lineHeight: 29,
  },
})
