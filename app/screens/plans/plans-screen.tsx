import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Location, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"

import { ScrollView } from "react-native-gesture-handler"
import RNUxcam from "react-native-ux-cam"
import { ModalLocation } from "../../components/location/modal-location"
import ModalDeliveryDatePlan from "../../components/modal-delivery-date/modal-delivery-date-plan"
import { useStores } from "../../models"
import { DatePlan } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import Banner from "./banner"
import Benefits from "./benefits"
import CreditSummary from "./credit-summary"
import Menu from "./menu"

const modalStateLocation = new ModalStateHandler()
const modalStateDeliveryDatePlan = new ModalStateHandler()

export const PlansScreen: FC<StackScreenProps<NavigatorParamList, "plans">> = observer(
  function PlansScreen({ navigation }) {
    const [currentDate, setCurrentDate] = useState<DatePlan>()
    const { plansStore, cartStore } = useStores()

    useEffect(() => {
      cartStore.setInRechargeProcess(false)
      RNUxcam.tagScreenName("plans")
    }, [])

    const recharge = () => {
      cartStore.setInRechargeProcess(true)
      navigation.navigate("subscription")
    }

    return (
      <Screen preset="fixed" style={styles.container}>
        <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={utilSpacing.px5}
          ></Location>
        </View>
        <ScrollView style={[styles.container, utilSpacing.pb6]}>
          {!plansStore.hasActivePlan ? (
            <>
              <Banner variant="light"></Banner>
              <Benefits></Benefits>
            </>
          ) : (
            <>
              <CreditSummary onRecharge={recharge}></CreditSummary>
            </>
          )}

          {currentDate?.date && (
            <Menu
              currentDate={currentDate}
              showModalDates={() => modalStateDeliveryDatePlan.setVisible(true)}
            ></Menu>
          )}

          {!plansStore.hasActivePlan && (
            <>
              <Text
                tx="mainScreen.priceLunch"
                preset="semiBold"
                style={[utilSpacing.pb5, utilFlex.selfCenter]}
              ></Text>

              <Banner variant="dark"></Banner>
            </>
          )}
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <ModalDeliveryDatePlan
          state={modalStateDeliveryDatePlan}
          onSelectDate={setCurrentDate}
        ></ModalDeliveryDatePlan>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btnBack: {
    alignItems: "center",
    backgroundColor: color.primaryDarker,
    borderRadius: 100,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  container: {
    backgroundColor: color.background,
  },
  containerLocation: {
    backgroundColor: color.primary,
    height: 63,
  },
})
