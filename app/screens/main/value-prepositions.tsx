import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Card, Image, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface Props {
  screenNavigate: (string: "plans" | "dishes") => void
}

const ValuePrepositions = ({ screenNavigate }: Props) => {
  const toScreen = (screen: "plans" | "dishes") => {
    screenNavigate(screen)
  }

  return (
    <View style={utilSpacing.px5}>
      <Text size="lg" preset="bold" tx="mainScreen.whatDoYouNeed"></Text>
      <View style={[utilFlex.flexRow, utilSpacing.pt5]}>
        <Card
          onPress={() => {
            toScreen("plans")
          }}
          style={[utilFlex.flex1, utilSpacing.p4, styles.cardPlans, utilSpacing.mr3]}
        >
          <View style={utilFlex.flex1}>
            <Image style={[styles.imgPlan, utilFlex.selfCenter]} source={images.plans}></Image>
          </View>
          <Text
            size="lg"
            style={[utilText.textCenter, utilSpacing.mt3]}
            preset="bold"
            tx="mainScreen.packageFoodHealthy"
          ></Text>
          <Image style={styles.imageLeaves} source={images.leaves}></Image>
        </Card>
        <Card
          onPress={() => {
            toScreen("dishes")
          }}
          style={[utilFlex.flex1, styles.cardDishes, utilSpacing.ml3]}
        >
          <View>
            <Image style={[styles.imgPlan, utilFlex.selfCenter]} source={images.dish}></Image>
          </View>
          <Text
            style={[utilText.textWhite, utilText.textCenter, utilSpacing.mt3]}
            size="lg"
            preset="bold"
            tx="mainScreen.dishesAndMore"
          ></Text>
        </Card>
      </View>
    </View>
  )
}

export default ValuePrepositions

const styles = StyleSheet.create({
  cardDishes: {
    backgroundColor: color.primary,
  },
  cardPlans: {
    backgroundColor: color.palette.gray300,
    overflow: "hidden",
  },
  imageLeaves: {
    height: 80,
    position: "absolute",
    right: -30,
    top: 0,
    width: 80,
  },
  imgPlan: {
    height: 90,
    width: 90,
  },
})
