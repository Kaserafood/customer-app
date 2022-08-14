import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import {
  ButtonFooter,
  Dish,
  EmptyData,
  Header,
  Image,
  ModalCart,
  ModalRequestDish,
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
import { DishChef } from "../../models/dish-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getFormat } from "../../utils/price"
import { getI18nText } from "../../utils/translate"
import { ModalLeave } from "./modal-clean-cart"

const modalStateCart = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
const modalStateLeave = new ModalStateHandler()

export const MenuChefScreen: FC<StackScreenProps<NavigatorParamList, "menuChef">> = observer(
  ({ navigation, route: { params } }) => {
    const { dayStore, commonStore, dishStore, cartStore, orderStore, userStore } = useStores()
    const [currentAction, setCurrentAction] = useState<any>()
    const { currencyCode, name, image, description, categories, id } = params.chef
    const [dishes, setDishes] = useState<DishChef[]>([])

    useEffect(() => {
      if (__DEV__) {
        console.log("MenuChefScreen: useEffect")
        console.log(params)
      }

      ;(async () => {
        dayStore.getDaysByChef(RNLocalize.getTimeZone(), id)
        if (params.isGetMenu) {
          await getDishByChef()
          setDishes(dishStore.dishesChef)
        } else {
          setDishes(dishStore.dishesChef)
        }
      })()
    }, [])

    useEffect(
      () =>
        navigation.addListener("beforeRemove", (e) => {
          e.preventDefault()
          setCurrentAction(e.data.action)
          const payload: any = e.data.action.payload

          if (payload.name === "registerForm" || !cartStore.hasItems) {
            navigation.dispatch(e.data.action)
          } else modalStateLeave.setVisible(true)
        }),
      [navigation],
    )

    const onPressLeave = () => {
      if (currentAction) {
        cartStore.cleanItems()
        navigation.dispatch(currentAction)
        modalStateLeave.setVisible(false)
      }
    }

    const onChangeDay = async (day: Day) => {
      dayStore.setCurrentDay(day)
      await getDishByChef()
    }

    const getDishByChef = async () => {
      commonStore.setVisibleLoading(true)
      await dishStore.getByChef(params.chef.id).finally(() => {
        commonStore.setVisibleLoading(false)
      })
    }

    const toDishDetail = (dish: DishModel) => {
      navigation.push("dishDetail", { ...dish, chef: params.chef })
    }

    const toDeliveryDetail = () => {
      // Id de usuario a ser -1 cuando entra como "Explora la app"
      if (userStore.userId === -1) {
        //  commonStore.setIsSignedIn(false)
        navigation.navigate("registerForm")
      } else navigation.navigate("deliveryDetail")
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
            days={dayStore.daysByChef}
            hideWhyButton
            onPress={(day) => {
              onChangeDay(day)
            }}
          ></DayDelivery>

          <View style={[styles.card, { ...SHADOW }]}>
            <View style={utilFlex.flexRow}>
              <View>
                <Image style={styles.imageChef} source={{ uri: image }}></Image>
                <Text size="lg" style={utilSpacing.mt4} preset="bold" text={name}></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text numberOfLines={5} style={utilSpacing.mx3} text={description}></Text>
              </View>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mt2, utilFlex.flexCenterVertical]}>
              <Text
                numberOfLines={3}
                preset="semiBold"
                style={[utilText.textGray, utilFlex.flex1]}
                text={getCategoriesName(categories)}
              ></Text>
              <Price
                amount={orderStore.priceDelivery}
                style={utilSpacing.ml3}
                preset="delivery"
                currencyCode={currencyCode}
              ></Price>
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
            {dishes.map((dish, index) => (
              <View key={dish.id}>
                <Dish
                  visibleChefImage={false}
                  visiblePriceDelivery={false}
                  dish={dish}
                  currencyCode={currencyCode}
                  onPress={() => toDishDetail(dish)}
                ></Dish>
                {index !== dishStore.dishesChef.length - 1 && (
                  <Separator style={utilSpacing.mb3}></Separator>
                )}
              </View>
            ))}
            <EmptyData
              lengthData={dishStore.dishesChef.length}
              onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
            ></EmptyData>
          </View>
        </ScrollView>
        {cartStore.hasItems && (
          <ButtonFooter
            onPress={() => modalStateCart.setVisible(true)}
            text={`${getI18nText("menuChefScreen.watchCart")} ${getFormat(
              cartStore.subtotal,
              currencyCode,
            )}`}
          ></ButtonFooter>
        )}

        <ModalCart
          chef={params.chef}
          onContinue={toDeliveryDetail}
          modal={modalStateCart}
        ></ModalCart>
        <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
        <ModalLeave modalState={modalStateLeave} onPressLeave={() => onPressLeave()}></ModalLeave>
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
