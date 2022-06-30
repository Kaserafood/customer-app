import React, { forwardRef, MutableRefObject, useImperativeHandle, useState } from "react"
import { View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Card, Checkbox } from "../../components"
import { utilSpacing } from "../../theme/Util"

export const deliverySlotTime = [
  {
    label: "12pm a 3pm",
    value: false,
  },
  {
    label: "3pm a 6pm",
    value: false,
  },
  {
    label: "6pm a 9pm",
    value: false,
  },
]

export const DeliveryTimeList = forwardRef(
  (props: { onSelectItem: (item: string) => void }, ref: MutableRefObject<any>) => {
    const [data, setData] = useState(deliverySlotTime)

    const changeValue = (value: boolean, index: number) => {
      let newData = [...data]
      newData = newData.map((item) => {
        item.value = false
        return item
      })
      newData[index].value = value
      setData(newData)
      props.onSelectItem(newData[index].label)
    }

    useImperativeHandle(ref, () => ({
      changeValue,
    }))

    return (
      <View>
        {data.map((item, index) => (
          <Card style={[utilSpacing.mb4, utilSpacing.mx4, utilSpacing.p1]} key={index}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => changeValue(!item.value, index)}
              style={utilSpacing.p2}
            >
              <Checkbox
                rounded
                style={utilSpacing.px3}
                value={item.value}
                preset="medium"
                text={item.label}
              ></Checkbox>
            </Ripple>
          </Card>
        ))}
      </View>
    )
  },
)
DeliveryTimeList.displayName = "DeliveryTimeList"
