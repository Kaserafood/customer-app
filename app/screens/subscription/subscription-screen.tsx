import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { ButtonFooter, Icon, Screen, Text } from "../../components"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { addDays, toFormatDate } from "../../utils/date"
import { ModalStateHandler } from "../../utils/modalState"
import Info from "./info"
import ModalChangePlan from "./modal-change-plan"
import Options from "./options"
import TestDish from "./test-dish"

const modalStatePlan = new ModalStateHandler()
const api = new Api()
export const Subscription: FC<StackScreenProps<NavigatorParamList, "subscription">> = observer(
  function SubscriptionScreen({ navigation, route: { params } }) {
    const { plansStore, userStore, cartStore } = useStores()
    const [counterCredits, setCounterCredits] = useState(0)

    useEffect(() => {
      cartStore.setInRechargeProcess(true)
    }, [])

    useEffect(() => {
      navigation.addListener("beforeRemove", () => {
        api.getAccount(userStore.userId, RNLocalize.getTimeZone()).then((response: any) => {
          plansStore.setPlan(response.data?.plan)
          cartStore.cleanItemsPlan()
          cartStore.setInRechargeProcess(false)
        })
      })
    }, [navigation])

    const goCheckout = () => {
      navigation.navigate("checkout", { isPlan: true })
    }

    const getBtnAddText = () => {
      return `${translate("common.add")} ${userStore.account?.currency} ${plansStore.totalPayment(
        counterCredits,
      )}`
    }

    const typePlan = (credits: number) => {
      if (credits > 0 && credits < 20) {
        return "basic"
      } else if (credits >= 20 && credits < 40) {
        return "happy"
      }

      return "prime"
    }

    const handleAdd = () => {
      const type = typePlan(counterCredits)
      plansStore.setTotalCredits(counterCredits)
      plansStore.setConsumedCredits(0)
      plansStore.setPrice(plansStore.totalPayment(counterCredits))
      plansStore.setType(type)
      plansStore.setIsCustom(true)

      let date = new Date()

      if (userStore.account?.date) date = new Date(userStore.account?.date)

      if (type === "happy") {
        plansStore.setExpireDate(toFormatDate(addDays(new Date(date), 30), "YYYY-MM-DD"))
      } else if (type === "prime") {
        plansStore.setExpireDate(toFormatDate(addDays(new Date(date), 60), "YYYY-MM-DD"))
      } else if (type === "basic") {
        plansStore.setExpireDate(toFormatDate(addDays(new Date(date), 7), "YYYY-MM-DD"))
      }

      if (cartStore.inRechargeProcess && !plansStore.hasCredits) {
        goCheckout()
      } else {
        navigation.navigate("menu")
      }
    }

    return (
      <Screen
        preset="fixed"
        statusBarBackgroundColor={color.palette.black}
        statusBar="dark-content"
      >
        <ScrollView>
          <View style={utilSpacing.p5}>
            <TouchableOpacity style={styles.btnBack} onPress={goBack}>
              <Icon name="xmark" size={30} color={color.text}></Icon>
            </TouchableOpacity>

            <Text
              tx="subscriptionScreen.description"
              preset="bold"
              size="xl"
              style={[utilSpacing.mt3, utilSpacing.mb1]}
            ></Text>
          </View>

          <Options
            toCheckout={goCheckout}
            onShowModalChangePlan={() => modalStatePlan.setVisible(true)}
            counterCredits={counterCredits}
            onCounterCreditsChange={(counter) => setCounterCredits(counter)}
          ></Options>

          {!plansStore.id && <TestDish></TestDish>}

          <Info></Info>
        </ScrollView>
        {counterCredits > 0 && (
          <ButtonFooter text={getBtnAddText()} onPress={handleAdd}></ButtonFooter>
        )}

        <ModalChangePlan state={modalStatePlan}></ModalChangePlan>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btnBack: {
    maxWidth: 30,
  },
})
