import React from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import images from "../../assets/images"
import { Card, Image, Text } from "../../components"
import { translate } from "../../i18n"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

const ScheduleDelivery = () => {
  const order = [
    {
      date: "2023-01-01",
      dateLongName: "Lunes 1 de Enero",
      dishes: [
        {
          id: 1,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 2,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 3,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },
      ],
    },
    {
      date: "2023-01-01",
      dateLongName: "Martes 2 de Enero",
      dishes: [
        {
          id: 3,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 4,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 5,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },
      ],
    },
    {
      date: "2023-01-01",
      dateLongName: "Viernes 4 de Enero",
      dishes: [
        {
          id: 67,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 9,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },

        {
          id: 32,
          name: "Pollo a la plancha, arroz y ensalada",
          quantity: 2,
          credits: 2,
        },
      ],
    },
  ]
  return (
    <View style={[styles.container, utilSpacing.p5, utilSpacing.mt6]}>
      <Text tx="menuSummary.scheduledDeliveries" size="lg" preset="bold"></Text>
      <Text tx="menuSummary.rememberDeliveryTime"></Text>

      {order.map((item) => (
        <View key={item.date}>
          <Text text={item.dateLongName} preset="semiBold" style={utilSpacing.mt5}></Text>

          {item.dishes.map((dish) => (
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
              <Ripple rippleContainerBorderRadius={16} style={[styles.remove, utilSpacing.p3]}>
                <Image source={images.close} style={styles.close}></Image>
              </Ripple>
            </Card>
          ))}
        </View>
      ))}
    </View>
  )
}

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
