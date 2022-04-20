import React, { useState } from "react"
import { ScrollView, StyleProp, ViewStyle, StyleSheet, View, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"

import { Separator } from "../separator/separator"
import { Categories } from "../categories/categories"
import { DayDelivery } from "../day-delivery/day-delivery"
import { Location } from "../location/location"
import { utilSpacing } from "../../theme/Util"
import { LocationModal } from "../location/location-modal"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Text } from "../text/text"
import { AutoImage } from "../auto-image/auto-image"
import images from "assets/images"
import { SvgUri } from "react-native-svg"
import Ripple from "react-native-material-ripple"
import PagerView from "react-native-pager-view"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"

export interface ChefsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Chefs = observer(function Chefs(props: ChefsProps) {
  const { style } = props

  const dataArray: any = [
    {
      id: 1,
      name: "Chef 1",
      image: images.chef1,
      dishes: [
        {
          id: 11,
          image: images.dish1,
          name: "Pedian de tes carnes",
        },
        {
          id: 12,
          image: images.dish2,
          name: "Orfdsao platillo para mostarar",
        },
        {
          id: 13,
          image: images.dish3,
          name: "Tercer paltillos param ostrar",
        },
      ],
      category: "Vegetariano - Mexicano",
      currentDish: "Pedian de tes carnes",
      pageView: null,
      currentIndexPage: 0,
    },
    {
      id: 2,
      name: "Chef 2",
      image: images.chef2,
      dishes: [
        {
          id: 11,
          image: images.dish3,
          name: "Pedian de tes carnes",
        },
        {
          id: 12,
          image: images.dish2,
          name: "Oadfsro platillo para mostarar",
        },
        {
          id: 13,
          image: images.dish1,
          name: "Tercer paltillos param ostrar",
        },
      ],
      category: "Vegetariano - Mexicano",
      currentDish: "Pedian de tes carnes",
      pageView: null,
      currentIndexPage: 0,
    },
  ]

  const [data, setData] = useState(dataArray)

  const nextDish = (item: any, index: number) => {
    if (item.currentIndexPage < item.dishes.length - 1) {
      const dataChange = [...data]
      item.pageView.setPage(item.currentIndexPage + 1)
      console.log("INDEX PAGE", item.currentIndexPage)
      data[index].currentDish = item.dishes[item.currentIndexPage + 1].name
      item.currentIndexPage++
      setData(dataChange)
    }
  }

  const previousDish = (item: any, index: number) => {
    if (item.currentIndexPage > 0) {
      const dataChange = [...data]
      item.pageView.setPage(item.currentIndexPage - 1)
      dataChange[index].currentDish = item.dishes[item.currentIndexPage - 1].name
      item.currentIndexPage--
      setData(dataChange)
    }
  }
  const [modalWhy, setModalWhy] = useState(false)
  const { dayStore } = useStores()
  const [currentDate, setCurrentDate] = useState<Day>({ dayName: "", date: "" })

  return (
    <>
      <ScrollView style={[style, styles.container]}>
        <Location></Location>
        <DayDelivery
          days={dayStore.days}
          onWhyPress={(state) => setModalWhy(state)}
          onPress={(day) => setCurrentDate(day)}
        ></DayDelivery>
        <Separator style={utilSpacing.my4}></Separator>
        <Categories></Categories>
        <Separator style={utilSpacing.my4}></Separator>
        <Text tx="chefs.delivery" preset="bold" size="lg"></Text>
        <Text text={currentDate.dayName}></Text>
        <View>
          {data.map((item, index) => (
            <View key={item.id}>
              <View style={styles.imageCarousel}>
                {item.currentIndexPage > 0 && (
                  <TouchableOpacity
                    onPress={() => previousDish(item, index)}
                    style={[styles.buttonCarousel, styles.btnPrevious, utilSpacing.mr2]}
                  >
                    <AutoImage style={styles.icon} source={images.previous}></AutoImage>
                  </TouchableOpacity>
                )}

                <PagerView
                  initialPage={0}
                  ref={(c) => {
                    item.pageView = c
                  }}
                  style={[styles.pagerView, styles.dish]}
                >
                  {item.dishes.map((dish) => (
                    <AutoImage key={dish.id} style={styles.dish} source={dish.image}></AutoImage>
                  ))}
                </PagerView>

                {item.currentIndexPage < item.dishes.length - 1 && (
                  <TouchableOpacity
                    onPress={() => nextDish(item, index)}
                    style={[styles.buttonCarousel, styles.btnNext, utilSpacing.ml2]}
                  >
                    <AutoImage style={styles.icon} source={images.next}></AutoImage>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.flex, styles.footer]}>
                <View style={styles.flex1}>
                  <Text size="sm" text={item.name} preset="bold"></Text>
                  <Text size="sm" text={item.currentDish} style={styles.text}></Text>
                  <View style={[styles.flex, styles.text]}>
                    <Text
                      style={[styles.flex1, styles.textCategory]}
                      size="sm"
                      text={item.category}
                    ></Text>
                    <AutoImage
                      style={[styles.iconShipping, styles.text, utilSpacing.mr3]}
                      source={images.iconShipping}
                    ></AutoImage>
                    <Text size="sm" tx="chefs.price" style={utilSpacing.mr3}></Text>
                  </View>
                </View>
                <View>
                  <AutoImage style={styles.imageChef} source={item.image}></AutoImage>
                </View>
              </View>

              <Separator style={utilSpacing.mb5}></Separator>
            </View>
          ))}
        </View>
      </ScrollView>
      <LocationModal></LocationModal>
      <DayDeliveryModal onClose={() => setModalWhy(false)} isVisible={modalWhy}></DayDeliveryModal>
    </>
  )
})

const styles = StyleSheet.create({
  btnNext: {
    right: 0,
  },
  btnPrevious: {
    left: 0,
  },
  buttonCarousel: {
    backgroundColor: color.palette.blackTransparent,
    borderRadius: 100,
    marginHorizontal: spacing[2],
    padding: spacing[2],
    position: "absolute",
    zIndex: 2,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },
  dish: {
    borderRadius: spacing[2],
    flex: 1,
    height: 180,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  footer: {
    alignItems: "flex-end",

    top: -28,
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconShipping: {
    height: 24,
    width: 24,
  },
  imageCarousel: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    height: 200,

    width: "100%",
  },
  imageChef: {
    borderColor: color.palette.white,
    borderRadius: spacing[2],
    borderWidth: 2,
    height: 90,
    marginRight: spacing[2],
    width: 90,
  },
  pagerView: {
    alignSelf: "center",
    display: "flex",
    flex: 1,
    width: "75%",
  },
  text: {
    marginTop: -4,
  },
  textCategory: {
    color: color.palette.grayDark,
  },
})
