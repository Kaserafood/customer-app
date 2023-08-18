import React from "react"
import { View } from "react-native"
import { Text } from "../../components"
import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"

interface Props {
  labelDeliveryTime: string
  isPlan: boolean
}
const DeliveryLabel = ({ labelDeliveryTime, isPlan }: Props) => {
  const { dayStore } = useStores()

  const getNameDayDelivery = (): string => {
    if (dayStore.currentDay.dayName.includes(" ")) return dayStore.currentDay.dayNameLong

    return `${dayStore.currentDay.dayName}  (${dayStore.currentDay.dayNameLong})`
  }

  return (
    <View>
      {isPlan ? (
        <View>
          <Text
            style={utilSpacing.mr2}
            preset="semiBold"
            size="lg"
            tx="checkoutScreen.datesDelivery"
          ></Text>
          <Text
            preset="semiBold"
            caption
            text={`Miercoles 13, Jueves 14, Viernes 15`}
            style={[utilSpacing.mb6, utilFlex.flex1]}
          ></Text>
        </View>
      ) : (
        <View>
          <Text
            style={utilSpacing.mr2}
            preset="semiBold"
            size="lg"
            tx="checkoutScreen.delivery"
          ></Text>
          <Text
            preset="semiBold"
            caption
            text={`${getNameDayDelivery()} ${labelDeliveryTime}`}
            style={[utilSpacing.mb6, utilFlex.flex1]}
          ></Text>
        </View>
      )}
    </View>
  )
}

export default DeliveryLabel
