import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
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
  Text,
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
    const {
      dayStore,
      commonStore,
      dishStore,
      cartStore,
      orderStore,
      userStore,
      messagesStore,
    } = useStores()
    const [currentAction, setCurrentAction] = useState<any>()
    const [dishes, setDishes] = useState<DishChef[]>([])

    useEffect(() => {
      modalStateCart.setVisible(false)
      if (__DEV__) console.log("MenuChefScreen: useEffect", params)
      ;(async () => {
        dayStore.getDaysByChef(RNLocalize.getTimeZone(), params.id).catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        if (params.isGetMenu || (!params.name || params.name?.length === 0)) {
          await getDishByChef()
          setDishes(dishStore.dishesChef)
        } else {
          setDishes(dishStore.dishesChef)
        }
      })()
      // El nombre no va venir en params si abre esta ventana desde el push notification
      if (!params.name || params.name?.length === 0) {
        commonStore.setVisibleLoading(true)
        ;(async () => {
          userStore
            .getInfoChef(params.id)
            .then((chef) => {
              console.log(chef)
              if (chef) navigation.setParams({ ...chef })
            })
            .catch((error: Error) => {
              messagesStore.showError(error.message)
            })
            .finally(() => {
              commonStore.setVisibleLoading(false)
            })
        })()
      }
    }, [])

    useEffect(
      () =>
        navigation.addListener("beforeRemove", (e) => {
          e.preventDefault()
          setCurrentAction(e.data.action)
          const payload: any = e.data.action.payload
          if (
            !cartStore.hasItems ||
            e.data.action.type !== "GO_BACK" ||
            payload?.name === "registerForm"
          ) {
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
      await dishStore
        .getByChef(params.id)
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          commonStore.setVisibleLoading(false)
        })
    }

    const toDishDetail = (dish: DishModel) => {
      AppEventsLogger.logEvent("MenuChefDishPress", 1, {
        dish: dish.title,
        dishId: dish.id,
        description: "Se ha presionado un platillo en la pantalla menu del chef",
      })

      navigation.push("dishDetail", { ...dish, chef: params })
    }

    const toDeliveryDetail = () => {
      modalStateCart.setVisible(false)
      // Id de usuario va ser -1 cuando entra como "Explora la app"
      if (userStore.userId === -1) {
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

    const openCart = () => {
      AppEventsLogger.logEvent("ViewCart", 1, {
        total: cartStore.subtotal,
        chefId: params.id,
        chefName: params.name,
        description: "Se ha presionado el boton de ver carrito en la pantalla menu del chef",
      })

      modalStateCart.setVisible(true)
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
            visibleLoading
          ></DayDelivery>

          <View style={[styles.card, { ...SHADOW }]}>
            <View style={utilFlex.flexRow}>
              <View>
                <Image style={styles.imageChef} source={{ uri: params.image }}></Image>
                <Text size="lg" style={utilSpacing.mt4} preset="bold" text={params.name}></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text numberOfLines={5} style={utilSpacing.mx3} text={params.description}></Text>
              </View>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mt2, utilFlex.flexCenterVertical]}>
              <Text
                numberOfLines={3}
                preset="semiBold"
                style={[utilText.textGray, utilFlex.flex1]}
                text={getCategoriesName(params.categories)}
              ></Text>
              <Price
                amount={orderStore.priceDelivery}
                style={utilSpacing.ml3}
                preset="delivery"
                currencyCode={params.currencyCode}
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
                  currencyCode={params.currencyCode}
                  onPress={() => toDishDetail(dish)}
                  sizeTextDescription="md"
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
            onPress={openCart}
            text={`${getI18nText("menuChefScreen.watchCart")} ${getFormat(
              cartStore.subtotal,
              params.currencyCode,
            )}`}
          ></ButtonFooter>
        )}

        <ModalCart chef={params} onContinue={toDeliveryDetail} modal={modalStateCart}></ModalCart>
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
