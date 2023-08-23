import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { useQuery } from "react-query"
import { Button, Card, Chip, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { Api } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

const Lunches = () => {
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

  const navigation = useNavigation()

  return (
    <View style={[styles.containerDishes, utilSpacing.mt5]}>
      <View style={utilSpacing.p5}>
        <View style={styles.containerTitle}>
          <Text tx="mainScreen.knowLunchPackages" preset="bold" size="lg"></Text>
          <View style={styles.bar}></View>
        </View>

        <View style={[utilFlex.flexRow, utilSpacing.my4, utilFlex.flexCenterVertical]}>
          <Text tx="mainScreen.exploreDailyMenu" style={utilFlex.flex1}></Text>
          <Chip textstyle={utilText.semiBold} text={currentDate.dateNameLong}></Chip>
        </View>
      </View>
      <View style={utilSpacing.pb5}>
        {lunches?.data?.map((lunch) => (
          <View key={lunch.id}>
            <Lunch
              {...lunch}
              onPress={() =>
                navigation.navigate(getI18nText("tabMainNavigation.packages") as never)
              }
            ></Lunch>
          </View>
        ))}

        <Card style={[utilSpacing.p5, utilSpacing.m5]}>
          <Text tx="mainScreen.pickOptions" style={[utilSpacing.mb5, utilText.textCenter]}></Text>
          <Button
            style={[utilFlex.selfCenter, styles.btnMore, utilSpacing.py4, utilSpacing.px0]}
            tx="common.moreInfo"
            onPress={() => navigation.navigate(getI18nText("tabMainNavigation.packages") as never)}
          ></Button>
        </Card>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    alignSelf: "flex-end",
    backgroundColor: color.primary,
    display: "flex",
    height: 2,
    width: 70,
  },
  btnMore: {
    minWidth: 230,
  },
  containerDishes: {
    backgroundColor: color.palette.whiteGray,
  },
  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
})

export default Lunches
