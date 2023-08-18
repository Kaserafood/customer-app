import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface Props {
  onDateChange: (date: string) => void
}

const Days = ({ onDateChange }: Props) => {
  const [selectedDate, setSelectedDate] = useState("")

  const days = [
    {
      date: "2023-01-01",
      dayName: "Lun",
      day: 1,
    },
    {
      date: "2023-01-02",
      dayName: "Mar",
      day: 2,
    },
    {
      date: "2023-01-03",
      dayName: "Mie",
      day: 3,
    },
    {
      date: "2023-01-04",
      dayName: "Jue",
      day: 4,
    },
    {
      date: "2023-01-05",
      dayName: "Vie",
      day: 5,
    },
    {
      date: "2023-01-06",
      dayName: "Sab",
      day: 6,
    },
  ]

  useEffect(() => {
    setSelectedDate(days[0].date)
  }, [])

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    onDateChange(date)
  }

  return (
    <View style={utilFlex.flexRow}>
      {days.map((day, index) => (
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
            index !== days.length - 1 && utilSpacing.mr3,
          ]}
          onPress={() => handleSelectDate(day.date)}
        >
          <Text
            text={`${day.day}`}
            preset="bold"
            size="lg"
            style={[day.date === selectedDate && utilText.textWhite, utilFlex.selfCenter]}
          ></Text>
          <Text
            text={day.dayName}
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
