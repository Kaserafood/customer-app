import React, { useEffect, useState } from "react"
import { ScrollView, StyleProp, View, ViewStyle, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { Separator } from "../separator/separator"
import { utilSpacing, utilFlex } from "../../theme/Util"
import { Location } from "../location/location"
import { DayDelivery } from "../day-delivery/day-delivery"
import { LocationModal } from "../location/location-modal"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Categories } from "../categories/categories"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import * as RNLocalize from "react-native-localize"
import { Loader } from "../loader/loader"
import LottieView from "lottie-react-native"
import { typographySize } from "../../theme/typography"
import { Category } from "../../models/category-store"
import { Dish as DishModel } from "../../models/dish-store"
import { useDay } from "../../common/hooks/useDay"
import { Dish } from "../dish/dish"
import { StackNavigationProp } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"

export interface HomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

type mainScreenProp = StackNavigationProp<NavigatorParamList, "main">
/**
 * Home page component used in Main Screen
 */
export const Home = observer(function Home(props: HomeProps) {
  const { style } = props

  const [modalWhy, setModalWhy] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const { onChangeDay } = useDay()
  const { dishStore, dayStore, modalStore, categoryStore } = useStores()
  const { days, setCurrentDay, currentDay } = dayStore

  const navigation = useNavigation<mainScreenProp>()

  const toCategory = (category: Category) => {
    navigation.navigate("category", {
      ...category,
    })
  }

  const toDetail = (dish: DishModel) => {
    navigation.navigate("dishDetail", {
      ...dish,
    })
  }

  useEffect(() => {
    async function fetch() {
      modalStore.setVisibleLoading(true)
      await dayStore.getDays(RNLocalize.getTimeZone())
      await dishStore.getAll(days[0].date, RNLocalize.getTimeZone())
      await categoryStore.getAll()
      setCurrentDay(days[0])

      validLengthDishes()
    }
    fetch().finally(() => modalStore.setVisibleLoading(false))
  }, [])

  const validLengthDishes = () => {
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
            validLengthDishes()
          }}
        ></DayDelivery>
        <Separator style={utilSpacing.my4}></Separator>
        <Categories
          categories={categoryStore.categories}
          onPress={(category) => toCategory(category)}
        ></Categories>
        <Separator style={utilSpacing.my4}></Separator>
        <View style={utilFlex.flexRow}>
          <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
          <Text size="lg" style={utilSpacing.ml3} preset="bold" text={currentDay.dayName}></Text>
        </View>

        <View style={utilSpacing.mb8}>
          {dishStore.dishes.map((dish, index) => (
            <View key={dish.id}>
              <Dish dish={dish} onPress={() => toDetail(dish)}></Dish>
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
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  flex1: {
    flex: 1,
  },
  iconShipping: {
    height: 24,
    marginLeft: spacing[4],
    width: 24,
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
