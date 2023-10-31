import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import * as RNLocalize from "react-native-localize"
import { DishChef, Text } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { DishParams } from "./dish.types"

interface Props {
  onPressDish: (dish: any) => void
}

const PopularDishes = observer(({ onPressDish }: Props) => {
  const { dishStore, dayStore, userStore, addressStore } = useStores()

  useEffect(() => {
    const params: DishParams = {
      date: dayStore.currentDay.date,
      timeZone: RNLocalize.getTimeZone(),
      userId: userStore.userId,
      latitude: addressStore.current.latitude,
      longitude: addressStore.current.longitude,
      cleanCurrentDishes: false,
      isFavorite: true,
      tokenPagination: null,
    }
    dishStore.getAll(params)
  }, [])

  return (
    <View style={[utilSpacing.pl5, utilSpacing.pt5]}>
      <View style={styles.containerTitle}>
        <Text tx="dishesScreen.moreWanted" preset="bold" size="lg"></Text>
        <View style={styles.bar}></View>
      </View>
      <ScrollView horizontal>
        {dishStore.dishesFavorites.map((dish) => (
          <DishChef
            onPress={() => onPressDish(dish)}
            dish={dish}
            key={dish.id}
            currencyCode={userStore.account?.currency}
          ></DishChef>
        ))}
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  bar: {
    alignSelf: "flex-end",
    backgroundColor: color.primary,
    display: "flex",
    height: 2,
    position: "relative",
    // right: -5,
    top: 4,
    width: 65,
  },
  containerTitle: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    display: "flex",
  },
})

export default PopularDishes
