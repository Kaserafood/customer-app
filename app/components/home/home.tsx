import React, { useEffect, useState } from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { Separator } from "../separator/separator"
import { AutoImage } from "../auto-image/auto-image"
import { utilSpacing, utilFlex } from "../../theme/Util"
import { Location } from "../location/location"
import { DayDelivery } from "../day-delivery/day-delivery"
import { LocationModal } from "../location/location-modal"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Categories } from "../categories/categories"
import { Price } from "../price/price"

import { useNavigation } from "@react-navigation/native"
import Ripple from "react-native-material-ripple"
import { Day } from "../../models/day-store"
import { useStores } from "../../models"
import * as RNLocalize from "react-native-localize"
import { Loader } from "../loader/loader"
import images from "assets/images"
import LottieView from "lottie-react-native"
import { typographySize } from "../../theme/typography"
import { Category } from "../../models/category-store"
import { useDay } from "../../common/hooks/useDay"

export interface HomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Home page component used in Main Screen
 */
export const Home = observer(function Home(props: HomeProps) {
  const { style } = props

  const [modalWhy, setModalWhy] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const navigation = useNavigation()
  const { currentDate, setCurrentDate, onChangeDay } = useDay()
  const { dishStore, dayStore, modalStore, categoryStore } = useStores()
  const { days } = dayStore

  const toDishDetail = () => navigation.navigate("dishDetail" as never)

  useEffect(() => {
    async function fetch() {
      modalStore.setVisibleLoading(true)
      await dayStore.getDays(RNLocalize.getTimeZone())
      await dishStore.getAll(days[0].date, RNLocalize.getTimeZone())
      await categoryStore.getAll()
      setCurrentDate(days[0])
      modalStore.setVisibleLoading(false)

      validLenghDishes()
    }
    fetch()
  }, [])

  const onChangeCategory = async (category: Category) => {
    modalStore.setVisibleLoading(true)
    await dishStore.getAll(currentDate.date, RNLocalize.getTimeZone(), category.categoryId)
    modalStore.setVisibleLoading(false)

    validLenghDishes()
  }

  const validLenghDishes = () => {
    if (dishStore.dishes.length === 0) setNotFound(true)
    else setNotFound(false)
  }

  return (
    <>
      <ScrollView style={[style, styles.container]}>
        <Location></Location>
        <DayDelivery
          days={dayStore.days}
          onWhyPress={(state) => setModalWhy(state)}
          onPress={(day) => {
            onChangeDay(day)
            validLenghDishes()
          }}
        ></DayDelivery>
        <Separator style={utilSpacing.my4}></Separator>
        <Categories
          categories={categoryStore.categories}
          onPress={(category) => onChangeCategory(category)}
        ></Categories>
        <Separator style={utilSpacing.my4}></Separator>
        <View style={utilFlex.flexRow}>
          <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
          <Text size="lg" style={utilSpacing.ml3} preset="bold" text={currentDate.dayName}></Text>
        </View>

        <View style={utilSpacing.mb8}>
          {dishStore.dishes.map((dish, index) => (
            <View key={dish.id}>
              <Ripple
                style={utilSpacing.py3}
                rippleOpacity={0.2}
                rippleDuration={200}
                onPress={toDishDetail}
              >
                <View style={styles.flex}>
                  <View style={[styles.column, styles.containerTextDish]}>
                    <View style={utilFlex.flex1}>
                      <Text
                        text={dish.title}
                        style={utilSpacing.mb1}
                        numberOfLines={1}
                        preset="semiBold"
                      ></Text>
                      <Text
                        text={dish.description}
                        style={[styles.descriptionDish, utilFlex.flex1]}
                        numberOfLines={2}
                      ></Text>

                      <Text
                        style={[styles.chefDish, utilSpacing.mt4]}
                        size="sm"
                        text={dish.chef.name}
                      ></Text>
                    </View>

                    <View style={[styles.flex, styles.containerPrice]}>
                      <Price amount={dish.price}></Price>
                      <AutoImage
                        style={styles.iconShipping}
                        source={images.iconShipping}
                      ></AutoImage>
                      <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                    </View>
                  </View>
                  <View style={styles.column}>
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
          <View>
            {notFound && !modalStore.isVisibleLoading && (
              <View>
                <LottieView
                  style={styles.notFound}
                  source={require("./notFound.json")}
                  autoPlay
                  loop
                />
                <Text style={styles.textNotFound} tx="common.notFound.dishes"></Text>
              </View>
            )}
          </View>

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
      <Loader></Loader>
    </>
  )
})

const styles = StyleSheet.create({
  chefDish: {
    alignSelf: "flex-start",
    color: color.palette.grayDark,
    marginBottom: spacing[0],
  },
  column: {
    height: 113,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  containerPrice: {
    alignItems: "flex-end",
    flexDirection: "row",
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
    height: 45,
    position: "absolute",
    right: spacing[1],
    width: 45,
  },
  imageDish: {
    borderRadius: 8,
    height: 95,
    width: 145,
  },

  notFound: {
    alignSelf: "center",
    display: "flex",
    height: 150,
    width: 150,
  },
  textNotFound: {
    alignSelf: "center",
    color: color.palette.grayDark,
    fontSize: typographySize.lg,
  },
})
