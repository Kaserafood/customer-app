import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Image, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

const Info = () => {
  return (
    <View>
      <View style={[utilFlex.flexRow, utilSpacing.p5, styles.credit, utilSpacing.mb4]}>
        <Image source={images.credit} style={styles.image}></Image>
        <View style={[utilFlex.flex1, utilSpacing.ml3]}>
          <Text
            tx="subscriptionScreen.whatAreCredits"
            preset="bold"
            size="lg"
            style={utilSpacing.mb2}
          ></Text>
          <Text>
            <Text tx="subscriptionScreen.creditIsDish" preset="bold"></Text>
            <Text tx="subscriptionScreen.creditDescription"></Text>
          </Text>
        </View>
      </View>
      <View style={[utilFlex.flexRow, utilSpacing.p5, utilSpacing.mb7, styles.payment]}>
        <Image source={images.schedule} style={styles.imageSchedule}></Image>
        <View style={[utilFlex.flex1, utilSpacing.ml4]}>
          <Text
            tx="subscriptionScreen.howWorksPayment"
            preset="bold"
            size="lg"
            style={utilSpacing.mb2}
          ></Text>
          <Text>
            <Text tx="subscriptionScreen.paymentDescription.part1"></Text>
            <Text tx="subscriptionScreen.paymentDescription.part2" preset="bold"></Text>
            <Text tx="subscriptionScreen.paymentDescription.part3"></Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  credit: {
    backgroundColor: color.palette.whiteGray,
  },

  image: {
    height: 100,
    width: 100,
  },
  imageSchedule: {
    height: 95,
    width: 95,
  },
  // eslint-disable-next-line react-native/no-color-literals
  payment: {
    backgroundColor: "#FFF1F0",
  },
})

export default Info
