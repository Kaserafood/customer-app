/* eslint-disable react-native/no-inline-styles */

import React, { useEffect } from "react"
import { Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { ScrollView } from "react-native-gesture-handler"

import { observer } from "mobx-react-lite"
import images from "../../assets/images"
import { Icon, Text } from "../../components"
import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { Banner as BannerModel } from "../../models/banner-store"
import { color, spacing, typography } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface PropsBanner {
  onPressWelcome: () => void
  onPressNewChefs: () => void
  onBannerPress: (banner: BannerModel) => void
}
const windowWidth = Dimensions.get("window").width

export const Banner = observer((props: PropsBanner) => {
  const { onPressWelcome, onPressNewChefs, onBannerPress } = props

  const { bannerStore } = useStores()

  useEffect(() => {
    ;(async () => {
      await bannerStore.getAll()
      await bannerStore.getNewChefs()
      await bannerStore.getWelcome()
    })()
  }, [])

  const onPressWelcomeBanner = () => {
    AppEventsLogger.logEvent("BannerPress", 1, {
      banner: "Welcome",
      description: "El usuario presionó el banner de 'Bienvenido'",
    })
    onPressWelcome()
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
        {bannerStore.showWelcome && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.containerImage, utilSpacing.mr3, utilSpacing.ml5]}
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
        )}

        {bannerStore.banners.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.7}
            style={[styles.containerImage, utilSpacing.mr3, index === 0 && utilSpacing.ml5]}
            onPress={() => onBannerPress(banner)}
          >
            <Image style={[styles.image, utilSpacing.mr3]} source={{ uri: banner.image }}></Image>

            <View
              style={[styles.containerText, utilFlex.flex1, utilFlex.flexCenter, utilFlex.flexRow]}
            >
              <View style={[utilFlex.flex1, utilSpacing.mx4]}>
                <Text
                  preset="bold"
                  style={[
                    styles.title,
                    utilFlex.selfCenter,
                    utilSpacing.mb1,
                    banner.textWhite && styles.textWhite,
                  ]}
                  text={banner.title}
                ></Text>
                <Text
                  preset="semiBold"
                  style={[
                    styles.description,
                    utilSpacing.mt2,
                    utilFlex.selfCenter,
                    banner.textWhite && styles.textWhite,
                  ]}
                  text={banner.description}
                ></Text>
                {banner.buttonText?.trim().length > 0 && (
                  <Button onPress={() => onBannerPress(banner)} text={banner.buttonText}></Button>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {bannerStore.showNewChefs && (
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
        )}
      </ScrollView>
    </View>
  )
})

interface ButtonProps {
  onPress: () => void
  text?: string
  tx?: TxKeyPath
}

const Button = ({ onPress, text, tx }: ButtonProps) => {
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
        <Text tx={tx} text={text} preset="bold" style={utilSpacing.mr3}></Text>
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

  containerImage: {
    borderRadius: 16,
    height: 165,
    overflow: "hidden",
    width: windowWidth - 75,
  },

  containerText: {
    position: "relative",
    zIndex: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
  },

  image: {
    borderRadius: 24,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  name: {
    fontFamily: typography.brand,
    fontSize: 45,
  },

  textWhite: {
    color: color.palette.white,
  },
  title: {
    fontSize: 22,
    lineHeight: 29,
  },
})
