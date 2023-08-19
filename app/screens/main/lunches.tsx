import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Card, Chip, Text } from "../../components"
import Lunch from "../../components/lunch/lunch"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

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
          <Chip textstyle={utilText.semiBold} text={`Lunes 24 de agosto`}></Chip>
        </View>
      </View>
      <View style={utilSpacing.pb5}>
        {lunches.map((lunch) => (
          <View key={lunch.id}>
            <Lunch {...lunch}></Lunch>
          </View>
        ))}

        <Card style={[utilSpacing.p5, utilSpacing.m5]}>
          <Text tx="mainScreen.pickOptions" style={[utilSpacing.mb5, utilText.textCenter]}></Text>
          <Button
            style={[utilFlex.selfCenter, styles.btnMore, utilSpacing.py4, utilSpacing.px0]}
            tx="common.moreInfo"
            onPress={() => navigation.navigate("plans" as never)}
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
