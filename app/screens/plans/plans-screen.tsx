import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Icon, Location, Screen, Text } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"

import { ScrollView } from "react-native-gesture-handler"
import RNUxcam from "react-native-ux-cam"
import { ModalLocation } from "../../components/location/modal-location"
import { ModalWithoutCoverageCredits } from "../../components/modal-coverage/modal-without-coverage-credits"
import ModalDeliveryDatePlan from "../../components/modal-delivery-date/modal-delivery-date-plan"
import { useStores } from "../../models"
import { DatePlan } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"
import Banner from "./banner"
import Benefits from "./benefits"
import CreditSummary from "./credit-summary"
import Menu from "./menu"
import { getInstanceMixpanel } from "../../utils/mixpanel"

const modalStateLocation = new ModalStateHandler()
const modalStateDeliveryDatePlan = new ModalStateHandler()
const modalStateCoverageCredits = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()

export const PlansScreen: FC<StackScreenProps<NavigatorParamList, "plans">> = observer(
  function PlansScreen({ navigation, route: { params } }) {
    const [currentDate, setCurrentDate] = useState<DatePlan>()
    const { plansStore, cartStore } = useStores()

    useEffect(() => {
      cartStore.setInRechargeProcess(false)
      RNUxcam.tagScreenName("plans")
      mixpanel.track("Plans Screen")
    }, [])

    const recharge = () => {
      cartStore.setInRechargeProcess(true)
      navigation.navigate("subscription")
    }

    return (
      <Screen preset="fixed" style={styles.container}>
        <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
          {params && params?.showBackIcon && (
            <TouchableOpacity
              style={[styles.btnBack, utilSpacing.ml5]}
              onPress={goBack}
              activeOpacity={0.5}
            >
              <Icon
                name="angle-left-1"
                style={utilSpacing.mr2}
                size={24}
                color={color.palette.white}
              ></Icon>
            </TouchableOpacity>
          )}
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
              <Banner
                variant="light"
                onShowModalCoverageCredits={() => modalStateCoverageCredits.setVisible(true)}
              ></Banner>
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
                text={getI18nText("mainScreen.priceLunch", {
                  price: plansStore.config.prime.price,
                })}
                preset="semiBold"
                style={[utilSpacing.py5, utilFlex.selfCenter]}
              ></Text>

              <Banner
                variant="dark"
                onShowModalCoverageCredits={() => modalStateCoverageCredits.setVisible(true)}
              ></Banner>
            </>
          )}
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <ModalDeliveryDatePlan
          state={modalStateDeliveryDatePlan}
          onSelectDate={setCurrentDate}
        ></ModalDeliveryDatePlan>
        <ModalWithoutCoverageCredits
          modalState={modalStateCoverageCredits}
        ></ModalWithoutCoverageCredits>
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
