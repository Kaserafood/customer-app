import React, { useEffect } from "react"
import { View } from "react-native"
import Ripple from "react-native-material-ripple"

import { Card, Checkbox, Separator, Text } from "../../components"
import { utilSpacing } from "../../theme/Util"
import { useStores } from "../../models"
import { loadString } from "../../utils/storage"
import { DeliveryTime } from "../../models/day-store"
import { observer } from "mobx-react-lite"
import { useEffectAsync } from "react-native-text-input-mask"

interface Props {
  onSelectItem: (item: string) => void
  chefId: number
}

export const DeliveryTimeList = observer(({ onSelectItem, chefId }: Props) => {
  const { dayStore } = useStores()

  useEffect(() => {
    ;(async () => {
      await dayStore.getDeliveryTime(chefId)
      const time = await loadString("deliveryTime")

      const current = dayStore.deliveryTime.find((item) => getLabel(item) === time)

      if (current) {
        changeValue(true, dayStore.deliveryTime.indexOf(current), getLabel(current))
      }
    })()
  }, [])

  useEffectAsync(async () => {
    await dayStore.getDeliveryTime(chefId)
    if (dayStore.deliveryTime.length === 0) {
      onSelectItem("")
    }
  }, [dayStore.currentDay.date])

  const changeValue = (value: boolean, index: number, label: string) => {
    dayStore.changeValueDeliveryTime(value, index)
    onSelectItem(label)
  }

  const getLabel = (item: DeliveryTime) => {
    return `${item.start} - ${item.end}`
  }

  return (
    <View>
      <Card style={[utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]}>
        <Text
          preset="semiBold"
          style={[utilSpacing.mx4, utilSpacing.mb4, utilSpacing.mt5]}
          tx="checkoutScreen.deliveryTime"
        ></Text>
        {dayStore.deliveryTime.map((item, index) => (
          <View key={index}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => changeValue(!item.value, index, getLabel(item))}
              style={utilSpacing.p2}
            >
              <Checkbox
                rounded
                style={utilSpacing.px3}
                value={item.value}
                preset="medium"
                text={getLabel(item)}
              ></Checkbox>
            </Ripple>
            {index !== dayStore.deliveryTime.length - 1 && (
              <Separator style={utilSpacing.mx4}></Separator>
            )}
          </View>
        ))}
      </Card>
    </View>
  )
})
DeliveryTimeList.displayName = "DeliveryTimeList"
