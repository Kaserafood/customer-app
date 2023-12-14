import React from "react"
import { StyleSheet, View } from "react-native"
import { useQuery } from "react-query"
import { Button, Card, Chip, Icon, Separator, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { useStores } from "../../models"
import { Api, DatePlan } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"

interface Props {
  currentDate: DatePlan
  showModalDates: () => void
  toPlans: () => void
}

const Lunches = ({ currentDate, showModalDates, toPlans }: Props) => {
  const api = new Api()
  const { messagesStore } = useStores()

  const { data: lunches } = useQuery(
    ["lunches", currentDate.date],
    () => api.getItemsPlan(currentDate.date, "lunch"),
    {
      enabled: !!currentDate.date,
      onError: (error) => {
        console.log(error)
        messagesStore.showError()
      },
    },
  )

  return (
    <Card style={[utilSpacing.p0, utilSpacing.m5]}>
      <View style={styles.containerDishes}>
        <View style={utilSpacing.p5}>
          <View>
            <Text>
              <Text tx="mainScreen.knowThe" size="lg"></Text>
              <Text tx="mainScreen.lunchPackages" size="lg" preset="bold"></Text>
            </Text>
          </View>

          <View style={[utilFlex.flexRow, utilSpacing.my4, utilFlex.flexCenterVertical]}>
            <Chip
              textstyle={utilText.semiBold}
              onPress={() => showModalDates()}
              text={currentDate.dateNameLong}
            ></Chip>
          </View>
        </View>

        <View style={[utilSpacing.px5, utilSpacing.pb5]}>
          {lunches?.data?.map((lunch) => (
            <View key={lunch.id}>
              <Lunch {...lunch} onPress={toPlans} style={utilSpacing.px3}></Lunch>
              <Separator></Separator>
            </View>
          ))}

          <View style={[utilSpacing.pt6, utilSpacing.mx5]}>
            <Button
              style={[utilFlex.selfCenter, styles.btnMore, utilSpacing.py4, utilSpacing.px0]}
              tx="mainScreen.seeMoreOptions"
              onPress={toPlans}
              iconRight={<Icon name="angle-right1" size={18} color={color.palette.white}></Icon>}
            ></Button>
          </View>
        </View>
        <View style={styles.circle}></View>
      </View>
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
})

export default Lunches
