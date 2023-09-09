import { useNavigation } from "@react-navigation/native"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Icon, Image, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { addDays, toFormatDate } from "../../utils/date"

interface Props {
  isRecharge: boolean
  onShowModalChangePlan: () => void
  toCheckout: () => void
}

const Options = ({ isRecharge, onShowModalChangePlan, toCheckout }: Props) => {
  const navigation = useNavigation()
  const { plansStore, userStore, cartStore } = useStores()

  const totalAvailable = useMemo(() => {
    return plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)
  }, [plansStore.totalCredits, cartStore.useCredits, plansStore.consumedCredits])

  const isCurrentTypeHappy = useMemo(() => {
    return plansStore.type === "happy" && plansStore.id > 0 && totalAvailable !== 0
  }, [plansStore.type, plansStore.id])

  const isCurrentTypePrime = useMemo(() => {
    return plansStore.type === "prime" && plansStore.id > 0 && totalAvailable !== 0
  }, [plansStore.type, plansStore.id])

  const handleSelect = (credits: number, price: number, type: string) => {
    if ((type === "happy" && isCurrentTypePrime) || (type === "prime" && isCurrentTypeHappy)) {
      onShowModalChangePlan()
      return
    }

    plansStore.setTotalCredits(credits)
    plansStore.setPrice(price)
    plansStore.setType(type)

    if (type === "happy") {
      plansStore.setExpireDate(
        toFormatDate(addDays(new Date(userStore.account.date), 30), "YYYY-MM-DD"),
      )
    } else if (type === "prime") {
      plansStore.setExpireDate(
        toFormatDate(addDays(new Date(userStore.account.date), 90), "YYYY-MM-DD"),
      )
    }

    if (isRecharge) {
      toCheckout()
    } else {
      navigation.navigate("menu" as never)
    }
  }
  return (
    <View style={[utilFlex.flexRow, utilSpacing.pb5, utilSpacing.px5]}>
      <View style={[utilFlex.flex1, utilSpacing.mr3, utilSpacing.pb5, styles.containerOption]}>
        <View style={[styles.containerImage1, utilFlex.flexCenter]}>
          <Image source={images.happy} style={styles.image}></Image>
        </View>
        <View style={[utilFlex.flex, utilFlex.flex1]}>
          <View style={[utilSpacing.p4, utilFlex.flex1]}>
            <Text tx="subscriptionScreen.happy" preset="bold" size="lg"></Text>
            <Text tx="subscriptionScreen.happyDescription" preset="semiBold"></Text>

            <View style={[utilFlex.flexRow, utilSpacing.mt5]}>
              <Icon name="check-1" size={14} color={color.palette.green}></Icon>
              <Text style={utilSpacing.ml3} tx="subscriptionScreen.threePerDay"></Text>
            </View>

            <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
              <Icon name="check-1" size={14} color={color.palette.green}></Icon>
              <Text style={utilSpacing.ml3} tx="subscriptionScreen.freeDelivery"></Text>
            </View>

            <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
              <Icon name="check-1" size={14} color={color.palette.green}></Icon>
              <Text style={utilSpacing.ml3} tx="subscriptionScreen.monthForUse"></Text>
            </View>
          </View>

          <View style={[utilFlex.flexRow, utilFlex.flexCenterHorizontal, utilSpacing.mt5]}>
            <Text tx="subscriptionScreen.priceHappy" style={utilSpacing.mr2}></Text>
            <Text preset="bold" tx="subscriptionScreen.priceHappyDishes"></Text>
          </View>

          <Button
            tx="common.select"
            style={[
              styles.btnSelect,
              utilSpacing.py3,
              utilSpacing.mx4,
              utilSpacing.px1,
              utilSpacing.mt5,
              isCurrentTypePrime && styles.opacity,
            ]}
            onPress={() => handleSelect(20, 940, "happy")}
          ></Button>
        </View>
      </View>
      <View style={[utilFlex.flex1, utilSpacing.ml3, utilSpacing.pb5, styles.containerOption]}>
        <View style={[styles.containerImage2, utilFlex.flexCenter]}>
          <Image source={images.prime} style={styles.image}></Image>
        </View>
        <View style={utilSpacing.p4}>
          <Text tx="subscriptionScreen.prime" preset="bold" size="lg"></Text>
          <Text tx="subscriptionScreen.primeDescription" preset="semiBold"></Text>

          <View style={[utilFlex.flexRow, utilSpacing.mt5]}>
            <Icon name="check-1" size={14} color={color.palette.green}></Icon>
            <Text style={utilSpacing.ml3} tx="subscriptionScreen.fourPerDay"></Text>
          </View>

          <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
            <Icon name="check-1" size={14} color={color.palette.green}></Icon>
            <Text style={utilSpacing.ml3} tx="subscriptionScreen.freeDelivery"></Text>
          </View>

          <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
            <Icon name="check-1" size={14} color={color.palette.green}></Icon>
            <Text style={utilSpacing.ml3} tx="subscriptionScreen.threeMonthsForUse"></Text>
          </View>

          <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
            <Icon name="check-1" size={14} color={color.palette.green}></Icon>
            <Text style={utilSpacing.ml3} tx="subscriptionScreen.snacksDrink"></Text>
          </View>
        </View>

        <View style={[utilFlex.flexRow, utilFlex.flexCenterHorizontal, utilSpacing.mt5]}>
          <Text tx="subscriptionScreen.pricePrime" style={utilSpacing.mr2}></Text>
          <Text preset="bold" tx="subscriptionScreen.pricePrimeDishes"></Text>
        </View>

        <Button
          tx="common.select"
          style={[
            styles.btnSelect,
            utilSpacing.py3,
            utilSpacing.mx4,
            utilSpacing.px1,
            utilSpacing.mt5,
            isCurrentTypeHappy && styles.opacity,
          ]}
          onPress={() => handleSelect(40, 1800, "prime")}
        ></Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnSelect: {
    width: "auto",
  },
  // eslint-disable-next-line react-native/no-color-literals
  containerImage1: {
    backgroundColor: "#F5DA48",
    borderBottomLeftRadius: spacing[5],
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
    minHeight: 120,
  },
  // eslint-disable-next-line react-native/no-color-literals
  containerImage2: {
    backgroundColor: "#B8D870",
    borderBottomLeftRadius: spacing[5],
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
    minHeight: 120,
  },
  containerOption: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[4],
    ...SHADOW,
  },
  image: {
    height: 100,
    width: 100,
  },
  opacity: {
    opacity: 0.5,
  },
})
export default Options
