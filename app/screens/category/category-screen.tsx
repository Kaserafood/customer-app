import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import { DayDelivery, Header, Screen, Text } from "../../components"
import { ScrollView } from "react-native-gesture-handler"
import { useStores } from "../../models"
import { useDay } from "../../common/hooks/useDay"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"

export const CategoryScreen: FC<StackScreenProps<NavigatorParamList, "category">> = observer(
  function CategoryScreen() {
    const { dayStore } = useStores()
    const [modalWhy, setModalWhy] = useState(false)
    const { onChangeDay } = useDay()

    return (
      <Screen preset="scroll">
        <Header headerText="Guatemalteca" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => setModalWhy(state)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>
        </ScrollView>
        <DayDeliveryModal
          onClose={() => setModalWhy(false)}
          isVisible={modalWhy}
        ></DayDeliveryModal>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({})
