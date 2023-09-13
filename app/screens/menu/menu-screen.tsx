import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Button, ButtonFooter, Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { DatePlan } from "../../services/api"
import { color, spacing } from "../../theme"
import { SHADOW, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import Days from "./days"
import GroupType from "./group-type"

export const MenuScreen: FC<StackScreenProps<NavigatorParamList, "menu">> = observer(
  ({ navigation, route: { params } }) => {
    const { cartStore, plansStore } = useStores()
    const [currentDate, setCurrentDate] = useState<DatePlan>()

    useEffect(() => {
      cartStore.cleanItemsPlan()
    }, [])

    useEffect(() => {
      if (plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits) <= 0) {
        cartStore.setHasCredits(false)
      } else cartStore.setHasCredits(true)
    }, [cartStore.useCredits, plansStore.totalCredits, plansStore.consumedCredits])

    const getLabelSummary = () => {
      return `${plansStore.totalCredits - (cartStore.useCredits + plansStore.consumedCredits)}/${
        plansStore.totalCredits
      } ${getI18nText("common.credits")}`
    }

    const handleScheduleLater = () => {
      cartStore.cleanItemsPlan()
      navigation.push("checkout", {
        isPlan: true,
      })
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="menuScreen.title" leftIcon="back" onLeftPress={goBack} />
        <View style={[styles.containerSummary, utilSpacing.px4, utilSpacing.py2]}>
          <Text
            style={utilText.textWhite}
            size="lg"
            preset="semiBold"
            text={getLabelSummary()}
          ></Text>
        </View>
        <ScrollView>
          <View style={[utilSpacing.p5, utilSpacing.mb3, utilSpacing.pt2]}>
            <Text
              tx="menuScreen.scheduleThisWeek"
              preset="bold"
              size="lg"
              style={utilSpacing.mb4}
            ></Text>

            <Days
              onDateChange={(date) => {
                setCurrentDate(date)
              }}
            ></Days>
          </View>
          {currentDate && (
            <View>
              <GroupType
                currentDate={currentDate}
                type="lunch"
                title="menuScreen.lunchDinner"
              ></GroupType>

              {plansStore.type === "prime" && (
                <View>
                  <GroupType
                    title="menuScreen.desserts"
                    currentDate={currentDate}
                    type="dessert"
                  ></GroupType>

                  <GroupType
                    title="menuScreen.snacksDrinks"
                    currentDate={currentDate}
                    type="snack"
                  ></GroupType>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <ButtonFooter
          disabled={cartStore.useCredits === 0}
          text={getI18nText("menuScreen.useCredits", {
            total: cartStore.useCredits,
          })}
          onPress={() => navigation.push("menuSummary")}
        >
          {cartStore.inRechargeProcess && (
            <Button
              preset="white"
              style={utilSpacing.py3}
              block
              tx="menuScreen.scheduleLater"
              onPress={handleScheduleLater}
            ></Button>
          )}
        </ButtonFooter>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  containerSummary: {
    alignSelf: "flex-end",
    backgroundColor: color.palette.green,
    borderBottomLeftRadius: spacing[2],
    borderTopLeftRadius: spacing[2],
    display: "flex",
    ...SHADOW,
    // position: "absolute",
  },
})

export default MenuScreen
