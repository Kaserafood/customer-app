import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Card, Image, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

const ValuePrepositions = () => {
  const navigation = useNavigation()

  const toPlans = () => {
    navigation.navigate("plans" as never)
  }

  return (
    <View style={utilSpacing.p5}>
      <Text size="lg" preset="semiBold" tx="mainScreen.whatDoYouNeed"></Text>
      <View style={[utilFlex.flexRow, utilSpacing.pt5]}>
        <Card
          onPress={() => {
            navigation.navigate(getI18nText("tabMainNavigation.packages") as never)
          }}
          style={[utilFlex.flex1, utilSpacing.px4, styles.cardPlans, utilSpacing.mr3]}
        >
          <Text size="lg" preset="bold" tx="mainScreen.packageFoodHealthy"></Text>
          <View style={[utilSpacing.mt3, utilFlex.flex1]}>
            <Text tx="mainScreen.dailyDeliveryFree" style={utilFlex.flex1}></Text>
            <Image
              style={[styles.imgPlan, utilFlex.selfCenter, utilSpacing.mt4]}
              source={images.plans}
            ></Image>
          </View>
        </Card>
        <Card
          onPress={() => {
            navigation.navigate(getI18nText("tabMainNavigation.dishes") as never)
          }}
          style={[utilFlex.flex1, styles.cardDishes, utilSpacing.ml3]}
        >
          <Text
            style={utilText.textWhite}
            size="lg"
            preset="bold"
            tx="mainScreen.dishesAndMore"
          ></Text>

          <View style={utilSpacing.mt3}>
            <Text
              tx="mainScreen.testIndividualDish"
              style={[utilFlex.flex1, utilText.textWhite]}
            ></Text>
            <Image
              style={[styles.imgPlan, utilFlex.selfCenter, utilSpacing.mt4]}
              source={images.dish}
            ></Image>
          </View>
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
  },
  imgPlan: {
    height: 90,
    width: 90,
  },
})
