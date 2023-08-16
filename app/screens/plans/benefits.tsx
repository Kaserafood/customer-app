import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Image, Text } from "../../components"
import { translate } from "../../i18n"
import { utilFlex, utilSpacing } from "../../theme/Util"

const Benefits = () => {
  const benefits = [
    {
      image: images.schedule,
      title: translate("mainScreen.scheduleDelivery"),
      description: translate("mainScreen.pickLunches"),
    },
    {
      image: images.food,
      title: translate("mainScreen.eatDelicious"),
      description: translate("mainScreen.optionsDay"),
    },
    {
      image: images.personCook,
      title: translate("mainScreen.madeChefs"),
      description: translate("mainScreen.profesionalChefs"),
    },
    {
      image: images.delivery,
      title: translate("mainScreen.freeDelivery"),
      description: translate("mainScreen.dailyReceive"),
    },
  ]

  return (
    <View style={utilSpacing.p5}>
      {benefits.map((benefit, index) => (
        <View key={index} style={[utilFlex.flexRow, utilSpacing.mb4]}>
          <Image style={styles.image} source={benefit.image}></Image>
          <View style={[utilFlex.flex1, utilSpacing.ml3]}>
            <Text text={benefit.title} preset="bold" style={utilSpacing.mb1}></Text>
            <Text text={benefit.description}></Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 60,
    width: 60,
  },
})

export default Benefits
