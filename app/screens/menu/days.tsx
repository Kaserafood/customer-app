import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { useQuery } from "react-query"
import { Text } from "../../components"
import { useStores } from "../../models"
import { Api, DatePlan } from "../../services/api"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface Props {
  onDateChange: (date: DatePlan) => void
}

const Days = ({ onDateChange }: Props) => {
  const api = new Api()
  const [selectedDate, setSelectedDate] = useState("")
  const { messagesStore } = useStores()

  const { data: days } = useQuery("dates-plans", () => api.getDatesPlans(), {
    onSuccess: (data) => {
      if (data.data.length > 0) handleSelectDate(data.data[0])
    },
    onError: (error) => {
      console.log(error)
      messagesStore.showError()
    },
  })

  const handleSelectDate = (date: DatePlan) => {
    setSelectedDate(date.date)
    onDateChange(date)
  }

  return (
    <View style={utilFlex.flexRow}>
      {days?.data?.map((day, index) => (
        <Ripple
          key={day.date}
          rippleOpacity={0.2}
          rippleDuration={400}
          style={[
            styles.date,
            utilFlex.flex,

            utilSpacing.py3,
            utilFlex.flex1,
            day.date === selectedDate && styles.active,
            index !== days?.data.length - 1 && utilSpacing.mr3,
          ]}
          onPress={() => handleSelectDate(day)}
        >
          <Text
            text={`${day.dateNumber}`}
            preset="bold"
            size="lg"
            style={[day.date === selectedDate && utilText.textWhite, utilFlex.selfCenter]}
          ></Text>
          <Text
            text={day.dayShort}
            style={[day.date === selectedDate && utilText.textWhite, utilFlex.selfCenter]}
          ></Text>
        </Ripple>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  date: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[2],
    borderWidth: 1,
  },
})
export default Days
