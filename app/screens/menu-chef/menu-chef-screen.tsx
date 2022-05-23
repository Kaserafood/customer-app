import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import {
  AutoImage,
  Dish,
  EmptyData,
  Header,
  Icon,
  ModalCart,
  Price,
  Screen,
  Separator,
  Text
} from "../../components"
import { DayDelivery } from "../../components/day-delivery/day-delivery"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { Dish as DishModel } from "../../models/dish"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getFormat } from "../../utils/price"

class ModalState {
  isVisible = false

  setVisible(state: boolean) {
    this.isVisible = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalState()
export const MenuChefScreen: FC<StackScreenProps<NavigatorParamList, "menuChef">> = observer(
  ({ navigation, route: { params } }) => {
    const { dayStore, commonStore, dishStore, cartStore } = useStores()

    useEffect(() => {
      console.log("MenuChefScreen: useEffect")
      console.log(params)
    },[])

    const onChangeDay = async (day: Day) => {
      commonStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await dishStore.getByChef(params.chef.id).finally(() => {
        commonStore.setVisibleLoading(false)
      })
    }

    const toDishDetail = (dish: DishModel) => {
      navigation.push("dishDetail", { ...dish, chef: params.chef })
    }

    const toDeliveryDetail = () => {
      navigation.navigate("deliveryDetail")
    }

    const getCategoriesName = (categories: Category[]) => {
      let categoriesStr = ""
      if (categories && Array.isArray(categories)) {
        categories.forEach((category) => {
          categoriesStr += `${category.name} - `
        })
        return categoriesStr.substring(0, categoriesStr.length - 2)
      }

      return ""
    }
    return (
      <Screen preset="fixed" style={styles.container}>
        <Header headerTx="menuChefScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView style={[styles.container, utilSpacing.pb6]}>
          <DayDelivery
            titleTx="menuChefScreen.dayDelivery"
            days={dayStore.days}
            hideWhyButton
            onPress={(day) => {
              onChangeDay(day)
            }}
          ></DayDelivery>

          <View style={[styles.card, { ...SHADOW }]}>
            <View style={utilFlex.flexRow}>
              <View>
                <AutoImage style={styles.imageChef} source={{ uri: params.chef.image }}></AutoImage>
                <Text
                  size="lg"
                  style={utilSpacing.mt2}
                  preset="bold"
                  text={params.chef.name}
                ></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text style={utilSpacing.mx3} text={params.chef.description}></Text>
              </View>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mt2, utilFlex.flexCenterVertical]}>
              <Text
                numberOfLines={1}
                preset="semiBold"
                style={[utilText.textGray, utilFlex.flex1]}
                text={getCategoriesName(params.chef.categories)}
              ></Text>
              <Price amount={30} style={utilSpacing.ml3} preset="delivery"></Price>
            </View>
          </View>
          <View style={utilSpacing.m4}>
            <Text
              preset="bold"
              size="lg"
              tx="menuChefScreen.chefMenu"
              style={styles.textSeparator}
            ></Text>
            <Separator style={utilSpacing.mt4}></Separator>
          </View>
          <View style={[utilSpacing.mb6, utilSpacing.mx5]}>
            {dishStore.dishesChef.map((dish, index) => (
              <View key={dish.id}>
                <Dish
                  visibleChefImage={false}
                  visiblePriceDelivery={false}
                  dish={dish}
                  onPress={() => toDishDetail(dish)}
                ></Dish>
                {index !== dishStore.dishesChef.length - 1 && (
                  <Separator style={utilSpacing.mb3}></Separator>
                )}
              </View>
            ))}
            <EmptyData lengthData={dishStore.dishesChef.length}></EmptyData>
          </View>
        </ScrollView>
        {cartStore.hasItems && (
          <TouchableOpacity
            onPress={() => modalState.setVisible(true)}
            activeOpacity={0.7}
            style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
          >
            <Icon name="cart" size={30} color={color.palette.white}></Icon>
            <Text
              preset="bold"
              style={[styles.textAddToOrder, utilSpacing.mx3]}
              tx="menuChefScreen.watchCart"
            ></Text>
            <Text
              preset="bold"
              style={styles.textAddToOrder}
              text={getFormat(cartStore.subtotal)}
            ></Text>
          </TouchableOpacity>
        )}

        <ModalCart chef={params.chef} onContinue={toDeliveryDetail} modal={modalState}></ModalCart>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  card: {
    backgroundColor: color.background,
    borderRadius: spacing[2],
    margin: spacing[3],
    padding: spacing[3],
  },
  container: {
    backgroundColor: color.background,
  },
  containerSeparator: {
    alignItems: "center",
  },
  imageChef: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
  textSeparator: {
    backgroundColor: color.palette.white,
    left: spacing[4],
    paddingHorizontal: spacing[2],
    position: "absolute",
    top: 1,
    zIndex: 1,
  },
})
