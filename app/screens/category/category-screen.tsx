import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import { DayDelivery, Dish, Header, Loader, Screen, Separator, Text } from "../../components"
import { ScrollView } from "react-native-gesture-handler"
import { useStores } from "../../models"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { useNavigation } from "@react-navigation/native"
import { utilSpacing } from "../../theme/Util"
import * as RNLocalize from "react-native-localize"
import LottieView from "lottie-react-native"
import { color, spacing, typographySize } from "../../theme"
import { Day } from "../../models/day-store"
import { Dish as DishModel } from "../../models/dish-store"

export const CategoryScreen: FC<StackScreenProps<NavigatorParamList, "category">> = observer(
  ({ route: { params }, navigation }) => {
    const {
      dayStore,
      dishStore: { dishesCategory, getAll },
      modalStore,
    } = useStores()
    const [modalWhy, setModalWhy] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
      console.log(params)
      async function fetch() {
        modalStore.setVisibleLoading(true)
        await getAll(dayStore.currentDay.date, RNLocalize.getTimeZone(), params.id)
      }

      fetch().finally(() => {
        modalStore.setVisibleLoading(false)
        validLengthDishes()
      })
    }, [])

    const validLengthDishes = () => {
      if (dishesCategory.length === 0) setNotFound(true)
      else setNotFound(false)
    }

    const onChangeDay = async (day: Day) => {
      modalStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await getAll(day.date, RNLocalize.getTimeZone(), params.id).finally(() => {
        modalStore.setVisibleLoading(false)
        validLengthDishes()
      })
    }

    const toDetail = (dish: DishModel) => {
      navigation.navigate("dishDetail", {
        ...dish,
      })
    }

    return (
      <Screen preset="fixed" style={styles.root}>
        <Header headerText={params.name} leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView style={styles.container}>
          <DayDelivery
            days={dayStore.days}
            onWhyPress={(state) => setModalWhy(state)}
            onPress={(day) => onChangeDay(day)}
          ></DayDelivery>
          <Text tx="common.dishes" preset="bold" size="lg" style={utilSpacing.my3}></Text>
          <View style={utilSpacing.mb8}>
            {dishesCategory.map((dish, index) => (
              <View key={dish.id}>
                <Dish dish={dish} onPress={() => toDetail(dish)}></Dish>

                {index !== dishesCategory.length - 1 && (
                  <Separator style={utilSpacing.my3}></Separator>
                )}
              </View>
            ))}
          </View>

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
        </ScrollView>
        <DayDeliveryModal
          onClose={() => setModalWhy(false)}
          isVisible={modalWhy}
        ></DayDeliveryModal>
        <Loader></Loader>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },
  notFound: {
    alignSelf: "center",
    display: "flex",
    height: 150,
    width: 150,
  },
  root: {
    backgroundColor: color.background,
  },
  textNotFound: {
    alignSelf: "center",
    color: color.palette.grayDark,
    fontSize: typographySize.lg,
  },
})
