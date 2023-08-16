import React from "react"
import { View } from "react-native"
import { Chip, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { utilSpacing, utilText } from "../../theme/Util"

const Menu = () => {
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
    <View style={utilSpacing.p5}>
      <Text
        style={utilSpacing.py5}
        tx="mainScreen.exploreAvailableMenus"
        preset="bold"
        size="lg"
      ></Text>
      <Chip
        style={utilSpacing.mb5}
        textstyle={utilText.semiBold}
        text={`Lunes 24 de agosto`}
      ></Chip>
      <Text style={utilSpacing.pb2} tx="mainScreen.dinnerLunch" preset="semiBold" size="lg"></Text>
      <Text tx="mainScreen.deliveryTime" style={utilSpacing.mb5}></Text>

      {lunches.map((lunch) => (
        <Lunch {...lunch} key={lunch.id}></Lunch>
      ))}
    </View>
  )
}

export default Menu
