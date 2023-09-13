import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { ButtonFooter, Header, Screen } from "../../components/"

import { FormProvider, useForm } from "react-hook-form"
import * as RNLocalize from "react-native-localize"
import { useMutation } from "react-query"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api, ReservationRequest } from "../../services/api"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"
import Consumption from "./consumption"
import CreditSummary from "./credit-summary"
import Fields from "./fields"
import ScheduleDelivery from "./schedule-delivery"

const modalStateLocation = new ModalStateHandler()
const api = new Api()
export const MenuSummaryScreen: FC<StackScreenProps<NavigatorParamList, "menuSummary">> = observer(
  ({ navigation, route: { params } }) => {
    const {
      cartStore,
      addressStore,
      userStore,
      plansStore,
      commonStore,
      messagesStore,
    } = useStores()
    const methods = useForm({
      defaultValues: {
        note: "",
      },
    })

    const { mutate: createReservation } = useMutation(
      (data: ReservationRequest) => api.createReservation(data),
      {
        onSuccess: (res) => {
          commonStore.setVisibleLoading(false)
          if (Number(res.data.value) > 0) {
            plansStore.setConsumedCredits(cartStore.useCredits + plansStore.consumedCredits)
            navigation.navigate("endOrder", {
              orderId: 0,
              deliveryDate: cartStore.datesDelivery,
              deliveryTime: getI18nText("checkoutScreen.deliveryTimePlan"),
              deliveryAddress: addressStore.current.address,
              imageChef:
                "https://kaserafood.com/wp-content/uploads/2022/02/cropped-WhatsApp-Image-2022-02-07-at-3.38.55-PM-min.jpeg",
              isPlan: true,
            })
          } else {
            messagesStore.showError()
          }
        },
        onError: () => {
          commonStore.setVisibleLoading(false)
        },
      },
    )

    const handleContinue = (data) => {
      // Id de usuario va ser -1 cuando entra como "Explora la app"
      if (userStore.userId === -1) {
        navigation.navigate("registerForm")
        return
      }

      if (plansStore.hasActivePlan && !cartStore.inRechargeProcess) {
        commonStore.setVisibleLoading(true)
        createReservation({
          orderPlanId: plansStore.id,
          items: cartStore.cartPlans.map((item) => ({
            recipeId: item.id,
            quantity: item.quantity,
            deliveryDate: item.date,
            credits: item.credits,
            name: item.name,
            description: item.description,
          })),
          timeZone: RNLocalize.getTimeZone(),
          userId: userStore.userId,
          commentToChef: data.commentToChef,
        })
      } else navigation.navigate("checkout", { isPlan: true, commentToChef: data.commentToChef })
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="menuSummary.title" leftIcon="back" onLeftPress={goBack} />
        <FormProvider {...methods}>
          <ScrollView style={utilSpacing.pb6}>
            <CreditSummary></CreditSummary>
            <Consumption></Consumption>
            <ScheduleDelivery></ScheduleDelivery>
            <Fields onOpenModalLocation={() => modalStateLocation.setVisible(true)}></Fields>
          </ScrollView>

          <ButtonFooter
            disabled={!cartStore.hasItemsPlan}
            onPress={methods.handleSubmit(handleContinue)}
            tx="common.confirm"
          ></ButtonFooter>
        </FormProvider>
        <ModalLocation screenToReturn={"menuSummary"} modal={modalStateLocation}></ModalLocation>
      </Screen>
    )
  },
)
