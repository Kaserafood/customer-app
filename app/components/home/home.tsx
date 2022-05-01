import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import * as RNLocalize from "react-native-localize"
import { useDay } from "../../common/hooks/useDay"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { DishChef as DishModel } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Categories } from "../categories/categories"
import { DayDelivery } from "../day-delivery/day-delivery"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Dish } from "../dish/dish"
import { EmptyData } from "../empty-data/empty-data"
import { Loader } from "../loader/loader"
import { Location } from "../location/location"
import { LocationModal } from "../location/location-modal"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"

class ModalState {
  isVisibleWhy = false

  setVisibleWhy(state: boolean) {
    this.isVisibleWhy = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalState()
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
    console.log("Home useEffect")
    async function fetch() {
      modalStore.setVisibleLoading(true)

      Promise.all([
        dayStore.getDays(RNLocalize.getTimeZone()),
        dishStore.getAll(days[0].date, RNLocalize.getTimeZone()),
        categoryStore.getAll(),
      ])
    }
    fetch()
      .then(() => setCurrentDay(days[0]))
      .finally(() => modalStore.setVisibleLoading(false))
  }, [])

  return (
    <>
      <ScrollView style={[style, styles.container]}>
        <Location></Location>
        <DayDelivery
          days={dayStore.days}
          onWhyPress={(state) => modalState.setVisibleWhy(state)}
          onPress={(day) => {
            console.log("clcik dary")
            onChangeDay(day)
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
          <EmptyData lengthData={dishStore.dishes.length}></EmptyData>

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
      <DayDeliveryModal modal={modalState}></DayDeliveryModal>
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
})
