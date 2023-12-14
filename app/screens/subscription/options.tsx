import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useQuery } from "react-query"
import images from "../../assets/images"
import { Button, Icon, Image, Price, Text } from "../../components"
import { useStores } from "../../models"
import { Api } from "../../services/api"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { addDays, toFormatDate } from "../../utils/date"
import { getI18nText } from "../../utils/translate"

interface Props {
  onShowModalChangePlan: () => void
  toCheckout: () => void
  counterCredits: number
  onCounterCreditsChange: (counter: number) => void
}
const api = new Api()
const windowWidth = Dimensions.get("window").width
const Options = observer(
  ({ onShowModalChangePlan, toCheckout, counterCredits, onCounterCreditsChange }: Props) => {
    const navigation = useNavigation()
    const { plansStore, userStore, cartStore, messagesStore } = useStores()

    const totalAvailable = useMemo(() => {
      return plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)
    }, [plansStore.totalCredits, cartStore.useCredits, plansStore.consumedCredits])

    const { isFetched } = useQuery("orders", () => api.getPlanConfig(), {
      onSuccess(data) {
        plansStore.setPlanConfig(data.data)
      },
      onError: (error) => {
        console.log(error)
        messagesStore.showError()
      },
    })

    const isCurrentTypeHappy = useMemo(() => {
      return (
        plansStore.type === "happy" &&
        plansStore.id > 0 &&
        totalAvailable !== 0 &&
        plansStore.hasActivePlan
      )
    }, [plansStore.type, plansStore.id])

    const isCurrentTypePrime = useMemo(() => {
      return (
        plansStore.type === "prime" &&
        plansStore.id > 0 &&
        totalAvailable !== 0 &&
        plansStore.hasActivePlan
      )
    }, [plansStore.type, plansStore.id])

    const handleSelect = (credits: number, price: number, type: string) => {
      if ((type === "happy" && isCurrentTypePrime) || (type === "prime" && isCurrentTypeHappy)) {
        onShowModalChangePlan()
        return
      }

      plansStore.setTotalCredits(credits)
      plansStore.setConsumedCredits(0)
      plansStore.setPrice(price)
      plansStore.setType(type)
      plansStore.setIsCustom(false)

      // El usuario no puede pagar en efectivo
      userStore.setPaymentCash(false)

      let date = new Date()

      if (userStore.account?.date) date = new Date(userStore.account?.date)

      if (type === "happy") {
        plansStore.setExpireDate(
          toFormatDate(addDays(new Date(date), plansStore.config.happy.days), "YYYY-MM-DD"),
        )
      } else if (type === "prime") {
        plansStore.setExpireDate(
          toFormatDate(addDays(new Date(date), plansStore.config.prime.days), "YYYY-MM-DD"),
        )
      }

      if (cartStore.inRechargeProcess && !plansStore.hasCredits) {
        toCheckout()
      } else {
        navigation.navigate("menu" as never)
      }
    }

    return (
      <View>
        <ScrollView horizontal style={[utilFlex.flexRow, utilSpacing.pb5]}>
          <View style={[utilSpacing.mb5, utilSpacing.ml5, styles.containerOption]}>
            <View style={[styles.containerImage1, utilFlex.flexCenter]}>
              <Image source={images.happy} style={styles.image}></Image>
            </View>
            <View style={[utilFlex.flex, utilFlex.flex1]}>
              <View style={[utilSpacing.p4, utilFlex.flex1]}>
                <Text tx="subscriptionScreen.happy" preset="bold" size="lg"></Text>
                <Text
                  text={getI18nText("subscriptionScreen.quantityDishes", {
                    quantity: plansStore.config.basic.maxCredits + 1,
                  })}
                  preset="semiBold"
                ></Text>

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
                  <Text
                    style={utilSpacing.ml3}
                    text={getI18nText("subscriptionScreen.daysToUse", {
                      days: plansStore.config.happy.days,
                    })}
                  ></Text>
                </View>
              </View>

              <View style={[utilFlex.flexRow, utilFlex.flexCenterHorizontal, utilSpacing.mt5]}>
                {/* <Text
                  text={getI18nText("subscriptionScreen.priceHappy", {
                    price: 
                  })}
                  style={utilSpacing.mr2}
                ></Text> */}
                <Price
                  amount={(plansStore.config.basic.maxCredits + 1) * plansStore.config.happy.price}
                  preset="simple"
                  textStyle={utilText.regular}
                ></Price>
                <Text
                  preset="bold"
                  text={getI18nText("subscriptionScreen.priceDishes", {
                    price: plansStore.config.happy.price,
                  })}
                  style={utilSpacing.ml2}
                ></Text>
              </View>

              <Button
                tx="common.select"
                style={[
                  styles.btnSelect,
                  utilSpacing.py3,
                  utilSpacing.mx4,
                  utilSpacing.px1,
                  utilSpacing.my5,
                  isCurrentTypePrime && styles.opacity,
                ]}
                onPress={() =>
                  handleSelect(
                    plansStore.config.basic.maxCredits + 1,
                    (plansStore.config.basic.maxCredits + 1) * plansStore.config.happy.price,
                    "happy",
                  )
                }
              ></Button>
            </View>
          </View>
          <View style={[utilSpacing.mx4, utilSpacing.mb5, styles.containerOption]}>
            <View style={[styles.containerImage2, utilFlex.flexCenter]}>
              <Image source={images.prime} style={styles.image}></Image>
            </View>
            <View style={[utilFlex.flex, utilFlex.flex1]}>
              <View style={[utilSpacing.p4, utilFlex.flex1]}>
                <Text tx="subscriptionScreen.prime" preset="bold" size="lg"></Text>
                <Text
                  text={getI18nText("subscriptionScreen.quantityDishes", {
                    quantity: plansStore.config.happy.maxCredits + 1,
                  })}
                  preset="semiBold"
                ></Text>
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
                  <Text
                    style={utilSpacing.ml3}
                    text={getI18nText("subscriptionScreen.daysToUse", {
                      days: plansStore.config.prime.days,
                    })}
                  ></Text>
                </View>

                <View style={[utilFlex.flexRow, utilSpacing.mt3]}>
                  <Icon name="check-1" size={14} color={color.palette.green}></Icon>
                  <Text style={utilSpacing.ml3} tx="subscriptionScreen.snacksDrink"></Text>
                </View>
              </View>

              <View style={[utilFlex.flexRow, utilFlex.flexCenterHorizontal, utilSpacing.mt5]}>
                <Price
                  amount={(plansStore.config.happy.maxCredits + 1) * plansStore.config.prime.price}
                  preset="simple"
                  textStyle={utilText.regular}
                ></Price>
                <Text
                  preset="bold"
                  text={getI18nText("subscriptionScreen.priceDishes", {
                    price: plansStore.config.prime.price,
                  })}
                  style={utilSpacing.ml2}
                ></Text>
              </View>

              <Button
                tx="common.select"
                style={[
                  styles.btnSelect,
                  utilSpacing.py3,
                  utilSpacing.mx4,
                  utilSpacing.px1,
                  utilSpacing.my5,
                  isCurrentTypeHappy && styles.opacity,
                ]}
                onPress={() =>
                  handleSelect(
                    plansStore.config.happy.maxCredits + 1,
                    (plansStore.config.happy.maxCredits + 1) * plansStore.config.prime.price,
                    "prime",
                  )
                }
              ></Button>
            </View>
          </View>

          {isFetched && (
            <View style={[utilSpacing.mb5, utilSpacing.mr5, styles.containerOption]}>
              <View style={[styles.containerImage3, utilFlex.flexCenter]}>
                <Image source={images.custom} style={styles.image}></Image>
              </View>

              <View style={[utilFlex.flex, utilFlex.flex1]}>
                <View style={[utilSpacing.p4, utilFlex.flex1]}>
                  <Text tx="subscriptionScreen.custom" preset="bold" size="lg"></Text>
                  <Text tx="subscriptionScreen.customDescription" preset="semiBold"></Text>

                  <View style={[utilFlex.flexRow, utilSpacing.mt5]}>
                    <Icon name="check-1" size={14} color={color.palette.green}></Icon>
                    <Text
                      style={utilSpacing.ml3}
                      text={getI18nText("subscriptionScreen.customPriceDelivery", {
                        price: plansStore.config.pricePerDay,
                        minimumQuantity: plansStore.config.minimumQuantityFreeDelivery,
                      })}
                    ></Text>
                  </View>

                  <View style={[utilFlex.flexRow, utilSpacing.mt5]}>
                    <Icon name="check-1" size={14} color={color.palette.green}></Icon>
                    <Text
                      style={utilSpacing.ml3}
                      text={getI18nText("subscriptionScreen.daysToUse", {
                        days: plansStore.config.basic.days,
                      })}
                    ></Text>
                  </View>

                  <View style={[utilFlex.felxColumn, utilFlex.flexCenter, utilSpacing.mt5]}>
                    <Text
                      preset="bold"
                      text={getI18nText("subscriptionScreen.priceCustom", {
                        price: plansStore.config.basic.price,
                      })}
                    ></Text>
                    <Text
                      text={getI18nText("subscriptionScreen.deliveryPerDay", {
                        price: plansStore.config.pricePerDay,
                      })}
                    ></Text>
                  </View>
                </View>

                <View style={[utilFlex.flexRow, utilFlex.flexCenter]}>
                  <TouchableOpacity
                    style={[
                      utilSpacing.p5,
                      utilSpacing.pr3,
                      counterCredits === 0 && styles.disabled,
                    ]}
                    onPress={() => onCounterCreditsChange(counterCredits - 1)}
                    disabled={counterCredits === 0}
                  >
                    <View style={[styles.btn, utilSpacing.p3]}>
                      <Icon name="minus" size={12} color={color.palette.white}></Icon>
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.counter, utilFlex.flex1, utilFlex.flexCenter]}>
                    <Text text={`${counterCredits ?? 0}`}></Text>
                  </View>

                  <TouchableOpacity
                    style={[utilSpacing.p5, utilSpacing.pl3]}
                    onPress={() => onCounterCreditsChange(counterCredits + 1)}
                  >
                    <View style={[styles.btn, utilSpacing.p3]}>
                      <Icon name="plus" size={12} color={color.palette.white}></Icon>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  btn: {
    backgroundColor: color.primary,
    borderRadius: spacing[2],
  },
  btnSelect: {
    width: "auto",
  },

  containerImage1: {
    backgroundColor: palette.yellow600,
    borderBottomLeftRadius: spacing[5],
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
    minHeight: 120,
  },

  containerImage2: {
    backgroundColor: palette.green600,
    borderBottomLeftRadius: spacing[5],
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
    minHeight: 120,
  },

  containerImage3: {
    backgroundColor: palette.pink,
    borderBottomLeftRadius: spacing[5],
    borderTopLeftRadius: spacing[4],
    borderTopRightRadius: spacing[4],
    minHeight: 120,
  },
  containerOption: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[4],
    width: windowWidth / 2 - 28,
    ...SHADOW,
  },
  counter: {
    borderColor: palette.grayLight,
    borderRadius: spacing[2],
    borderWidth: 1,
    height: 32,
  },

  disabled: {
    opacity: 0.5,
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
