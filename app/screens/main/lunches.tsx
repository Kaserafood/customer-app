import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import { useQuery } from "react-query"
import { Button, Card, Chip, Icon, Separator, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { Api, DatePlan } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getI18nText } from "../../utils/translate"

interface Props {
  currentDate: DatePlan
  showModalDates: () => void
}

const Lunches = ({ currentDate, showModalDates }: Props) => {
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

  const navigation = useNavigation()

  return (
    <Card style={[styles.containerDishes, utilSpacing.m5]}>
      <View style={utilSpacing.p3}>
        <View style={styles.containerTitle}>
          <Text>
            <Text tx="mainScreen.knowThe" size="lg"></Text>
            <Text tx="mainScreen.lunchPackages" size="lg" preset="bold"></Text>
          </Text>
        </View>

        <View style={[utilFlex.flexRow, utilSpacing.my4, utilFlex.flexCenterVertical]}>
          {/* <Text tx="mainScreen.exploreDailyMenu" style={utilFlex.flex1}></Text> */}
          <Chip
            textstyle={utilText.semiBold}
            onPress={() => showModalDates()}
            text={currentDate.dateNameLong}
          ></Chip>
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
              style={utilSpacing.px3}
            ></Lunch>
            <Separator></Separator>
          </View>
        ))}

        <View style={[utilSpacing.pt6, utilSpacing.mx5]}>
          {/* <Text tx="mainScreen.pickOptions" style={[utilSpacing.mb5, utilText.textCenter]}></Text> */}
          <Button
            style={[utilFlex.selfCenter, styles.btnMore, utilSpacing.py3, utilSpacing.px0]}
            tx="mainScreen.seeMoreOptions"
            onPress={() => navigation.navigate(getI18nText("tabMainNavigation.packages") as never)}
            iconRight={<Icon name="angle-right1" size={18} color={color.palette.white}></Icon>}
          ></Button>
        </View>
      </View>
      <View style={styles.circle}></View>
    </Card>
  )
}

const styles = StyleSheet.create({
  btnMore: {
    minWidth: 230,
  },
  circle: {
    backgroundColor: palette.green200,
    borderRadius: 300,
    height: 150,
    position: "absolute",
    right: -75,
    top: -75,
    width: 150,
    zIndex: -1,
  },
  containerDishes: {
    overflow: "hidden",
  },
  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
})

export default Lunches
