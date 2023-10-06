import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import images from "../../assets/images"
import { Card, Image, Text } from "../../components"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

const ScheduleDelivery = observer(() => {
  const { cartStore } = useStores()

  const getFormattedData = () => {
    const dates = []

    cartStore.cartPlans.forEach((item) => {
      dates.push({
        date: item.date,
        dateLongName: item.dateLongName,
      })
    })

    const uniqueDates = dates.filter(
      (item, index, self) => index === self.findIndex((t) => t.date === item.date),
    )

    // Order by date
    uniqueDates.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return uniqueDates.map((item) => ({
      ...item,
      items: cartStore.cartPlans.filter((dish) => dish.date === item.date),
    }))
  }

  return (
    <View style={[styles.container, utilSpacing.p5, utilSpacing.mt6]}>
      <Text tx="menuSummary.scheduledDeliveries" size="lg" preset="bold"></Text>
      <Text tx="menuSummary.rememberDeliveryTime"></Text>

      {getFormattedData().map((item) => (
        <View key={item.date}>
          <Text text={item.dateLongName} preset="semiBold" style={utilSpacing.mt5}></Text>

          {item.items.map((dish) => (
            <Card
              key={dish.id}
              style={[
                utilFlex.flexRow,
                styles.card,
                utilSpacing.p4,
                utilSpacing.mt4,
                utilFlex.flexCenterVertical,
              ]}
            >
              <Text size="lg" text={`X${dish.quantity}`} style={utilSpacing.mr4}></Text>
              <View>
                <Text text={dish.name}></Text>
                <Text
                  caption
                  size="sm"
                  text={`${dish.credits} ${translate("common.credits")}`}
                ></Text>
              </View>
              <Ripple
                onPress={() => cartStore.removeItemPlan(dish.id, dish.date)}
                rippleContainerBorderRadius={16}
                style={[styles.remove, utilSpacing.p3]}
              >
                <Image source={images.close} style={styles.close}></Image>
              </Ripple>
            </Card>
          ))}
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    position: "relative",
  },
  close: {
    height: 16,
    width: 16,
  },
  container: {
    backgroundColor: color.palette.whiteGray,
  },
  remove: {
    position: "absolute",
    right: 0,
    top: 0,
  },
})

export default ScheduleDelivery
