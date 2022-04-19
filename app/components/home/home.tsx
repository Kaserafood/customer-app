import React, { useEffect, useState } from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { Separator } from "../separator/separator"
import { AutoImage } from "../auto-image/auto-image"
import { utilSpacing, utilFlex } from "../../theme/Util"
import Images from "assets/images"
import { Location } from "../location/location"
import { DayDelivery } from "../day-delivery/day-delivery"
import { LocationModal } from "../location/location-modal"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Categories } from "../categories/categories"
import { Price } from "../price/price"
import { DishChef } from "../dish-chef/dish-chef"

import { useNavigation } from "@react-navigation/native"
import Ripple from "react-native-material-ripple"
import { Day } from "../../models/day-store"
import { useStores } from "../../models"
import * as RNLocalize from "react-native-localize"

export interface HomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Home page component
 */
export const Home = observer(function Home(props: HomeProps) {
  const { style } = props
  const [currentDate, setCurrentDate] = useState<Day>({ dayName: "", date: "" })
  const [modalWhy, setModalWhy] = useState(false)

  const navigation = useNavigation()

  const toDishDetail = () => navigation.navigate("dishDetail" as never)
  const toInit = () => navigation.navigate("init" as never)
  const { dishStore, dayStore, modalStore } = useStores()

  const { days } = dayStore

  useEffect(() => {
    async function fetch() {
      modalStore.setVisibleLoading(true)
      await dayStore.getDays(RNLocalize.getTimeZone())
      await dishStore.getAll(days[0].date, RNLocalize.getTimeZone())
      setCurrentDate(days[0])
      modalStore.setVisibleLoading(false)
    }
    fetch()
  }, [])

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
        <View style={utilFlex.flexRow}>
          <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
          <Text size="lg" style={utilSpacing.ml3} preset="bold" text={currentDate.dayName}></Text>
        </View>

        <View>
          {dishStore.dishes.map((dish, index) => (
            <View key={dish.id}>
              <Ripple
                style={utilSpacing.my5}
                rippleOpacity={0.2}
                rippleDuration={200}
                onPress={toDishDetail}
              >
                <View style={styles.flex}>
                  <View style={styles.containerTextDish}>
                    <Text text={dish.title} preset="semiBold"></Text>
                    <Text
                      text={dish.description}
                      style={styles.descriptionDish}
                      numberOfLines={2}
                    ></Text>

                    <Text
                      style={[styles.chefDish, utilSpacing.mt4]}
                      size="sm"
                      text={dish.chef.name}
                    ></Text>

                    <View style={[styles.flex, styles.containerPrice]}>
                      <Price amount={dish.price}></Price>
                      <AutoImage
                        style={styles.iconShipping}
                        source={Images.iconShipping}
                      ></AutoImage>
                      <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                    </View>
                  </View>
                  <View>
                    <AutoImage style={styles.imageDish} source={{ uri: dish.image }}></AutoImage>
                    <AutoImage
                      style={styles.imageChef}
                      source={{ uri: dish.chef.image }}
                    ></AutoImage>
                  </View>
                </View>
              </Ripple>
              {index !== dishStore.dishes.length - 1 && (
                <Separator style={utilSpacing.my3}></Separator>
              )}
            </View>
          ))}

          {/* 
          <Text
            style={utilSpacing.mt4}
            size="lg"
            tx="mainScreen.favoriteTomorrow"
            preset="bold"
          ></Text>

          <Separator style={utilSpacing.my3}></Separator>
          <ScrollView horizontal style={styles.flex}>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
          </ScrollView>
          <Separator style={utilSpacing.my3}></Separator> */}
        </View>
      </ScrollView>
      <LocationModal></LocationModal>
      <DayDeliveryModal onClose={() => setModalWhy(false)} isVisible={modalWhy}></DayDeliveryModal>
    </>
  )
})

const styles = StyleSheet.create({
  chefDish: {
    color: color.palette.grayDark,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  containerPrice: {
    alignItems: "flex-end",
  },

  containerTextDish: {
    flex: 1,
    marginRight: spacing[3],
  },

  descriptionDish: {
    color: color.palette.grayDark,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  iconShipping: {
    height: 24,
    marginLeft: spacing[4],
    width: 24,
  },

  imageChef: {
    borderColor: color.palette.white,
    borderRadius: 16,
    borderWidth: 1,
    bottom: 0,
    height: 50,
    position: "absolute",
    right: spacing[1],
    width: 50,
  },
  imageDish: {
    borderRadius: 8,
    height: 105,
    width: 140,
  },
})
