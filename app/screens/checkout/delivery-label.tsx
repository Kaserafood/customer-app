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
  const { dayStore, cartStore } = useStores()

  const getNameDayDelivery = (): string => {
    if (dayStore.currentDay.dayName.includes(" ")) return dayStore.currentDay.dayNameLong

    return `${dayStore.currentDay.dayName}  (${dayStore.currentDay.dayNameLong})`
  }

  const getDatesDelivery = () => {
    const dates = []

    cartStore.cartPlans.forEach((item) => {
      dates.push(item.dateShortName)
    })

    const uniqueDates = dates.filter(
      (item, index, self) => index === self.findIndex((t) => t === item),
    )

    return uniqueDates.join(", ")
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
            text={getDatesDelivery()}
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
