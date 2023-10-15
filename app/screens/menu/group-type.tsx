import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import { useQuery } from "react-query"
import { Card, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { Api, DatePlan } from "../../services/api"
import { utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"

interface Props {
  currentDate: DatePlan
  type: "snack" | "dessert" | "lunch"
  title: TxKeyPath
}

const GroupType = observer(({ currentDate, type, title }: Props) => {
  const api = new Api()
  const { cartStore, plansStore } = useStores()
  const { date, dateNameLong, dateNameShort } = currentDate

  const data =
    useQuery(["lunches", date, type], () => api.getItemsPlan(date, type), {
      enabled: !!date,
      onError: (error) => {
        console.log(error)
      },
    }).data?.data?.slice(0, plansStore.type === "prime" ? 3 : 2) ?? []

  const handleButton = (id: number, quantity: number, totalCredits: number) => {
    const item = data?.find((lunch) => lunch.id === id)

    const values = {
      id,
      quantity,
      credits: totalCredits,
      date,
      name: item?.name,
      description: item?.description,
      recipeId: item?.recipeId,
      dateLongName: dateNameLong,
      dateShortName: dateNameShort,
      amountPaymentKitchen: item?.amountPaymentKitchen,
    }
    if (cartStore.exitsItemPlan(id, date)) {
      if (quantity === 0) cartStore.removeItemPlan(id, date)
      else cartStore.updateItemPlan(values)
    } else {
      cartStore.addItemPlan(values)
    }
  }

  return (
    <View style={styles.bg}>
      {data?.length > 0 && (
        <View style={[utilSpacing.px5, utilSpacing.pt5]}>
          <Text tx={title} preset="bold" size="lg"></Text>
          {type === "lunch" && <Text tx="menuScreen.deliveryTime"></Text>}
        </View>
      )}

      <View style={utilSpacing.pb5}>
        {data?.map((lunch) => (
          <Card key={lunch.id} style={[utilSpacing.mx5, utilSpacing.mt5]}>
            <Lunch
              {...lunch}
              showButtons
              onPressButton={handleButton}
              totalCredits={cartStore.itemPlanCredits(lunch.id, date)}
              quantity={cartStore.itemPlanQuantity(lunch.id, date)}
              style={utilSpacing.px3}
            ></Lunch>

            {/* {index !== data?.length - 1 && <Separator style={utilSpacing.my2}></Separator>} */}
          </Card>
        ))}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  bg: { backgroundColor: palette.whiteGray },
})

export default GroupType
