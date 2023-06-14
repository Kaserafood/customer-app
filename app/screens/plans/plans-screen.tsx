import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StatusBar, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { ButtonFooter, Icon, Screen, Text } from "../../components"
import LinearGradient from "react-native-linear-gradient"

import { color } from "../../theme"
import Video from "react-native-video"
import { ScrollView } from "react-native-gesture-handler"
import { utilSpacing } from "../../theme/Util"
import images from "../../assets/images"
import ItemBenefit from "./item-benefit"
import { TxKeyPath } from "../../i18n"
import { openWhatsApp } from "../../utils/linking"
import RNUxcam from "react-native-ux-cam"

export const PlansScreen: FC<StackScreenProps<NavigatorParamList, "plans">> = observer(
  function PlansScreen() {
    useEffect(() => {
      RNUxcam.tagScreenName("plans")
    }, [])

    const benefits = [
      {
        title: "plansScreen.benefits.benefit1" as TxKeyPath,
        image: images.mark,
        backgroundColorImage: "#C8E6C9",
      },
      {
        title: "plansScreen.benefits.benefit2" as TxKeyPath,
        image: images.hour,
        backgroundColorImage: "#BBDEFB",
      },
      {
        title: "plansScreen.benefits.benefit3" as TxKeyPath,
        image: images.healthy,
        backgroundColorImage: "#D1C4E9",
      },

      {
        title: "plansScreen.benefits.benefit4" as TxKeyPath,
        image: images.fresh,
        backgroundColorImage: "#B2DFDB",
      },

      {
        title: "plansScreen.benefits.benefit5" as TxKeyPath,
        image: images.trunkFood,
        backgroundColorImage: "#FFE0B2",
      },

      {
        title: "plansScreen.benefits.benefit6" as TxKeyPath,
        image: images.microwave,
        backgroundColorImage: "#B2EBF2",
      },
    ]

    const toWhatsApp = () => {
      RNUxcam.logEvent("openWhatsAppPlans")
      openWhatsApp("plansScreen.messageWhatsApp")
    }

    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={"transparent"} translucent></StatusBar>
        <Video
          source={{
            uri: "https://kaserafood.com/wp-content/uploads/2023/06/Studio_Project_V2.mp4",
          }}
          style={styles.backgroundVideo}
          resizeMode={"cover"}
          repeat
          poster="https://kaserafood.com/wp-content/uploads/2023/06/pexels-photo-2284604.webp"
          posterResizeMode="cover"
        />
        <LinearGradient
          colors={["#ffffff35", "#fff"]}
          style={styles.layerGradient}
        ></LinearGradient>
        <View style={utilSpacing.px4}>
          <Text tx="plansScreen.title" preset="bold" style={[styles.title, utilSpacing.mb6]}></Text>

          {benefits.map((benefit, index) => (
            <ItemBenefit key={index} {...benefit}></ItemBenefit>
          ))}

          <ButtonFooter
            borderTop={false}
            style={utilSpacing.my3}
            onPress={() => toWhatsApp()}
            iconLeft={
              <Icon name="whatsapp" style={utilSpacing.mr1} size={24} color={color.palette.white} />
            }
            tx="plansScreen.moreInfo"
          ></ButtonFooter>
        </View>
      </ScrollView>
    )
  },
)

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 220,
    position: "absolute",
    width: "100%",
  },
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  layerGradient: {
    height: 220,
  },
  title: {
    fontSize: 30,
    marginTop: -50,
  },
})
