import React from "react"
import { StyleSheet, View } from "react-native"
import { Separator, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { utilSpacing } from "../../theme/Util"

const Lunches = () => {
  const lunches = [
    {
      id: 23,
      name: "Pollo a la plancha, arroz y ensalada",
      description: "Pollo a la plancha, arroz y ensalada, servido con jugo de naranja",
      image:
        "https://www.cocinavital.mx/wp-content/uploads/2023/08/cuanto-cuesta-hacer-chiles-en-nogada-634x420.jpg",
      tags: [
        {
          label: "Casera",
          value: "gluten-free",
        },
        {
          label: "Sin ",
          value: "lactose-free",
        },
      ],
    },
    {
      id: 5434,
      name: "Pollo a la plancha, arroz y ensalada",
      description: "Pollo a la plancha, arroz y ensalada, servido con jugo de naranja",
      image:
        "https://www.cocinavital.mx/wp-content/uploads/2023/08/cuanto-cuesta-hacer-chiles-en-nogada-634x420.jpg",
      tags: [
        {
          label: "Sin gluten",
          value: "gluten-free",
        },
        {
          label: "Sin lactosa",
          value: "lactose-free",
        },
        {
          label: "Sin azucar",
          value: "sugar-free",
        },
        {
          label: "Sin sal",
          value: "salt-free",
        },
        {
          label: "Sin lactosa",
          value: "lactose-free",
        },
        {
          label: "Sin azucar",
          value: "sugar-free",
        },
        {
          label: "Sin sal",
          value: "salt-free",
        },
      ],
    },
    {
      id: 233,
      name: "Pollo a la plancha, arroz y ensalada",
      description: "Pollo a la plancha, arroz y ensalada, servido con jugo de naranja",
      image:
        "https://www.cocinavital.mx/wp-content/uploads/2023/08/cuanto-cuesta-hacer-chiles-en-nogada-634x420.jpg",
      tags: [
        {
          label: "Sin gluten",
          value: "gluten-free",
        },
        {
          label: "Sin lactosa",
          value: "lactose-free",
        },
        {
          label: "Sin azucar",
          value: "sugar-free",
        },
        {
          label: "Sin sal",
          value: "salt-free",
        },
        {
          label: "Sin lactosa",
          value: "lactose-free",
        },
        {
          label: "Sin azucar",
          value: "sugar-free",
        },
        {
          label: "Sin sal",
          value: "salt-free",
        },
      ],
    },
  ]

  return (
    <View style={styles.containerDishes}>
      <View style={utilSpacing.p5}>
        <Text tx="menuScreen.lunchDinner" preset="bold" size="lg"></Text>
        <Text tx="menuScreen.deliveryTime"></Text>
      </View>
      <View style={[utilSpacing.px5, utilSpacing.pb5, utilSpacing.pt3]}>
        {lunches.map((lunch, index) => (
          <View key={lunch.id}>
            <Lunch {...lunch} showButtons></Lunch>

            {index !== lunches.length - 1 && <Separator style={utilSpacing.my5}></Separator>}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerDishes: {
    // backgroundColor: color.palette.whiteGray,
  },
})

export default Lunches
