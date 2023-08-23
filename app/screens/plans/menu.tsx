import React, { useState } from "react"
import { View } from "react-native"
import { useQuery } from "react-query"
import { Chip, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { Api } from "../../services/api"
import { utilSpacing, utilText } from "../../theme/Util"
import { useNavigation } from "@react-navigation/native"

const Menu = () => {
  const navigation = useNavigation()
  const api = new Api()
  const [currentDate, setCurrentDate] = useState({
    date: "",
    dateNameLong: "",
  })

  const { data: lunches } = useQuery(
    ["lunches", currentDate.date],
    () => api.getLunches(currentDate.date),
    {
      enabled: !!currentDate.date,
      onSuccess: (data) => {
        console.log(data)
      },

      onError: (error) => {
        console.log(error)
      },
    },
  )

  useQuery("dates-plans", () => api.getDatesPlans(), {
    onSuccess: (data) => {
      if (data.data.length > 0) setCurrentDate(data.data[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return (
    <View style={utilSpacing.py5}>
      <View style={utilSpacing.px5}>
        <Text
          style={utilSpacing.py5}
          tx="mainScreen.exploreAvailableMenus"
          preset="bold"
          size="lg"
        ></Text>
        <Chip
          style={utilSpacing.mb5}
          textstyle={utilText.semiBold}
          text={currentDate.dateNameLong}
        ></Chip>
        <Text
          style={utilSpacing.pb2}
          tx="mainScreen.dinnerLunch"
          preset="semiBold"
          size="lg"
        ></Text>
        <Text tx="mainScreen.deliveryTime" style={utilSpacing.mb5}></Text>
      </View>

      {lunches?.data?.map((lunch) => (
        <Lunch
          {...lunch}
          key={lunch.id}
          onPress={() => navigation.navigate("subscription" as never)}
        ></Lunch>
      ))}
    </View>
  )
}

export default Menu
