import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Card, Image, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { addDays, toFormatDate } from "../../utils/date"
import { getI18nText } from "../../utils/translate"

const TestDish = observer(() => {
  const { plansStore } = useStores()
  const navigation = useNavigation()

  const handleSelect = (credits: number, price: number, type: string) => {
    navigation.navigate("menu" as never)
    plansStore.setTotalCredits(credits)
    plansStore.setPrice(price)
    plansStore.setType(type)
    if (type === "test") {
      plansStore.setExpireDate(
        toFormatDate(addDays(new Date(), plansStore.config.test.days), "YYYY-MM-DD"),
      )
    }
  }
  return (
    <Card style={[styles.container, utilFlex.flexRow, utilSpacing.m5, utilSpacing.p0]}>
      <View style={[styles.containerImage, utilFlex.flexCenter, utilSpacing.mr3]}>
        <Image source={images.plans} style={styles.image}></Image>
      </View>
      <View style={utilFlex.flex1}>
        <Text
          tx="subscriptionScreen.youAreNotSure"
          size="lg"
          preset="semiBold"
          style={utilSpacing.mt4}
        ></Text>
        <View style={utilSpacing.mt2}>
          <Text>
            <Text tx="subscriptionScreen.testFirstDish"></Text>
            <Text
              tx="subscriptionScreen.withFreeDelivery"
              style={[utilText.textPrimary, utilSpacing.px4]}
            ></Text>
            <Text tx="subscriptionScreen.withoutCommitment"></Text>
          </Text>
        </View>

        <Text
          text={getI18nText("subscriptionScreen.forOnly", { price: plansStore.config.test.price })}
          size="lg"
          style={utilSpacing.mt3}
          preset="semiBold"
        ></Text>

        <Button
          tx="common.select"
          style={[utilSpacing.py3, utilSpacing.px1, utilSpacing.my5, utilSpacing.mr3, styles.btn]}
          onPress={() =>
            handleSelect(
              plansStore.config.test.maxCredits,
              plansStore.config.test.price * plansStore.config.test.maxCredits,
              "test",
            )
          }
        ></Button>
      </View>
    </Card>
  )
})

const styles = StyleSheet.create({
  btn: {
    width: "auto",
  },

  container: {
    borderRadius: spacing[3],
    overflow: "hidden",
  },
  containerImage: {
    backgroundColor: color.palette.grayLight,
    width: 140,
  },
  image: {
    height: 100,
    width: 100,
  },
})

export default TestDish
