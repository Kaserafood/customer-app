import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { useQuery } from "react-query"
import { Chip, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { useStores } from "../../models"
import { Api, DatePlan } from "../../services/api"
import { utilSpacing, utilText } from "../../theme/Util"

interface Props {
  currentDate: DatePlan
  showModalDates: () => void
}

const Menu = ({ currentDate, showModalDates }: Props) => {
  const navigation = useNavigation()
  const { userStore, plansStore } = useStores()
  const api = new Api()

  const { data: lunches } = useQuery(
    ["lunches", currentDate.date],
    () => api.getItemsPlan(currentDate.date, "lunch"),
    {
      enabled: !!currentDate.date,
      onError: (error) => {
        console.log(error)
      },
    },
  )

  const handlePressDish = () => {
    if (!plansStore.id) {
      navigation.navigate("subscription" as never)
    } else {
      navigation.navigate("menu" as never)
    }
  }

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
          onPress={() => showModalDates()}
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
        <Lunch {...lunch} key={lunch.id} onPress={handlePressDish}></Lunch>
      ))}
    </View>
  )
}

export default Menu
