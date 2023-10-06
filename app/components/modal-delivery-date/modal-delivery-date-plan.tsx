import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import { useQuery } from "react-query"
import { Api, DatePlan } from "../../services/api"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"

interface Props {
  state: ModalState
  onSelectDate: (date: DatePlan) => void
}

const ModalDeliveryDatePlan = ({ state, onSelectDate }: Props) => {
  const api = new Api()
  const [currentDate, setCurrentDate] = useState<DatePlan>()

  const { data: dates } = useQuery("dates-plans", () => api.getDatesPlans(), {
    onSuccess: (data) => {
      if (data.data.length > 0) handleSelectDate(data.data[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handleSelectDate = (date: DatePlan) => {
    setCurrentDate(date)
    onSelectDate(date)
  }

  return (
    <Modal state={state} position="bottom">
      <View>
        <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
          <Text
            tx="modalDeliveryDate.deliveryDate"
            preset="bold"
            style={[utilSpacing.mr4, utilSpacing.ml3]}
          ></Text>
        </View>
        <ScrollView style={[utilSpacing.mt5, styles.body]}>
          {dates?.data.map((day, index) => (
            <Card
              style={[
                utilSpacing.mb4,
                utilSpacing.mx3,
                utilSpacing.p0,
                index === 0 && utilSpacing.mt3,
              ]}
              key={day.date}
            >
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                style={[utilSpacing.px3, utilSpacing.py2]}
                onPress={() => handleSelectDate(day)}
              >
                <Checkbox
                  rounded
                  value={day.date === currentDate?.date}
                  preset="medium"
                  text={day.dateNameLong}
                ></Checkbox>
              </Ripple>
            </Card>
          ))}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  body: {
    maxHeight: 350,
  },
})

export default ModalDeliveryDatePlan
