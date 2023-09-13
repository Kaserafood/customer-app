import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import { useQuery } from "react-query"
import { Separator, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { useStores } from "../../models"
import { Api, DatePlan } from "../../services/api"
import { utilSpacing } from "../../theme/Util"

interface Props {
  currentDate: DatePlan
}

const SnacksDrinks = observer(({ currentDate }: Props) => {
  const api = new Api()
  const { cartStore } = useStores()
  const { date, dateNameLong, dateNameShort } = currentDate

  const { data: snacksDrinks } = useQuery(
    ["snacks-drinks", date],
    () => api.getItemsPlan(date, "snack"),
    {
      enabled: !!date,
      onError: (error) => {
        console.log(error)
      },
    },
  )

  const handleButton = (id: number, quantity: number, totalCredits: number) => {
    if (cartStore.exitsItemPlan(id, date)) {
      cartStore.updateItemPlan({
        id,
        quantity,
        credits: totalCredits,
        date,
        name: snacksDrinks?.data?.find((lunch) => lunch.id === id)?.name,
        description: snacksDrinks?.data?.find((lunch) => lunch.id === id)?.description,
        dateLongName: dateNameLong,
        dateShortName: dateNameShort,
      })
    } else {
      cartStore.addItemPlan({
        id,
        quantity,
        credits: totalCredits,
        date,
        name: snacksDrinks?.data?.find((lunch) => lunch.id === id)?.name,
        description: snacksDrinks?.data?.find((lunch) => lunch.id === id)?.description,
        dateLongName: dateNameLong,
        dateShortName: dateNameShort,
      })
    }
  }

  return (
    <View style={styles.containerDishes}>
      <View style={utilSpacing.p5}>
        <Text tx="menuScreen.snacksDrinks" preset="bold" size="lg"></Text>
      </View>
      <View style={[utilSpacing.pb5, utilSpacing.pt3]}>
        {snacksDrinks?.data?.map((lunch, index) => (
          <View key={lunch.id}>
            <Lunch
              {...lunch}
              showButtons
              onPressButton={handleButton}
              totalCredits={cartStore.itemPlanCredits(lunch.id, date)}
              quantity={cartStore.itemPlanQuantity(lunch.id, date)}
            ></Lunch>

            {index !== snacksDrinks?.data?.length - 1 && (
              <Separator style={utilSpacing.my5}></Separator>
            )}
          </View>
        ))}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  containerDishes: {
    // backgroundColor: color.palette.whiteGray,
  },
})

export default SnacksDrinks
