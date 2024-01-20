import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { ScrollView, StatusBar, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"

import {
  ButtonFooter,
  Dish,
  EmptyData,
  Icon,
  Image,
  ModalCart,
  ModalRequestDish,
  Separator,
  Text,
} from "../../components"
import { useStores } from "../../models"
import { Dish as DishModel } from "../../models/dish"
import { DishChef } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getFormat } from "../../utils/price"
import { getI18nText } from "../../utils/translate"

import { TouchableOpacity } from "react-native-gesture-handler"
import RNUxcam from "react-native-ux-cam"
import { useQuery } from "react-query"
import { goBack } from "../../navigators"
import { Api } from "../../services/api"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalLeave } from "./modal-clean-cart"

const modalStateCart = new ModalStateHandler()
const modalStateRequestDish = new ModalStateHandler()
const modalStateLeave = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()
const api = new Api()

export const MenuChefScreen: FC<StackScreenProps<NavigatorParamList, "menuChef">> = observer(
  ({ navigation, route: { params } }) => {
    const { commonStore, dishStore, cartStore, userStore, messagesStore } = useStores()
    const [currentAction, setCurrentAction] = useState<any>()
    const [dishes, setDishes] = useState<DishChef[]>([])
    const [days, setDays] = useState<string[]>([])
    const [bannerUrl, setBannerUrl] = useState<string>("")

    useEffect(() => {
      if (params.showModalCart) modalStateCart.setVisible(true)
      else modalStateCart.setVisible(false)
      if (__DEV__) console.log("MenuChefScreen: useEffect", params)
      ;(async () => {
        if (params.isGetMenu || !params.name || params.name?.length === 0) {
          await getDishByChef()
          setDishes(dishStore.dishesChef)
        } else {
          setDishes(dishStore.dishesChef)
        }
      })()
      // El nombre no va venir en params si abre esta ventana desde el push notification
      if (!params.name || params.name?.length === 0) {
        RNUxcam.tagScreenName("menuChef")
        commonStore.setVisibleLoading(true)
        ;(async () => {
          userStore
            .getInfoChef(params.id)
            .then((chef) => {
              if (chef) navigation.setParams({ ...chef, id: Number(params.id) })
            })
            .catch((error: Error) => {
              messagesStore.showError(error.message)
            })
            .finally(() => {
              commonStore.setVisibleLoading(false)
            })
        })()
      }
      mixpanel.track("Menu chef screen")
    }, [])

    useQuery("getDays", () => api.getDaysByChef(params.id), {
      onSuccess: (data) => {
        setDays(data.data?.value.split(","))
      },
      onError: () => {
        messagesStore.showError()
      },
    })

    useQuery("getBanner", () => api.getBanner(params.id), {
      onSuccess: (data) => {
        setBannerUrl(data.data?.value)
      },
      onError: () => {
        messagesStore.showError()
      },
    })

    useEffect(
      () =>
        navigation.addListener("beforeRemove", (e) => {
          console.log("MenuChefScreen: beforeRemove", e.data.action)
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

    // const onChangeDay = async (day: Day) => {
    //   dayStore.setCurrentDay(day)
    //   await getDishByChef()
    //   RNUxcam.logEvent("changeDate", {
    //     screen: "menuChef",
    //   })

    //   mixpanel.track("Change date", {
    //     screen: "menuChef",
    //   })
    // }

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
      dishStore.setIsUpdate(false)
      navigation.push("dishDetail", {
        ...dish,
        chef: params,
        tempId: null,
        quantity: undefined,
        noteChef: undefined,
        timestamp: undefined,
      })
    }

    const toCheckout = () => {
      modalStateCart.setVisible(false)
      // Id de usuario va ser -1 cuando entra como "Explora la app"
      if (userStore.userId === -1) {
        navigation.navigate("registerForm")
      } else navigation.navigate("checkout")
    }

    // const getCategoriesName = (categories: Category[]) => {
    //   let categoriesStr = ""
    //   if (categories && Array.isArray(categories)) {
    //     categories.forEach((category) => {
    //       categoriesStr += `${category.name} - `
    //     })
    //     return categoriesStr.substring(0, categoriesStr.length - 2)
    //   }

    //   return ""
    // }

    const openCart = () => {
      RNUxcam.logEvent("openCart", {
        total: cartStore.subtotal,
        chefId: params.id,
        chefName: params.name,
      })

      mixpanel.track("Open cart", {
        total: cartStore.subtotal,
        chefId: params.id,
        chefName: params.name,
      })

      AppEventsLogger.logEvent("ViewCart", 1, {
        total: cartStore.subtotal,
        chefId: params.id,
        chefName: params.name,
        description: "Se ha presionado el boton de ver carrito en la pantalla menu del chef",
      })

      modalStateCart.setVisible(true)
    }
    return (
      <>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={"transparent"}
            translucent
          ></StatusBar>
          <View style={styles.containerBtnBack}>
            <TouchableOpacity onPress={goBack} style={styles.btnBack}>
              <Icon name="angle-left-1" style={styles.iconBack} size={24} color={color.text}></Icon>
            </TouchableOpacity>
          </View>
          <ScrollView style={utilSpacing.pb6}>
            <View style={styles.containerBackground}>
              <Image
                source={{
                  uri: bannerUrl,
                }}
                style={styles.bgImage}
                resizeMode="cover"
              ></Image>

              <Image
                style={[styles.imageChef, utilSpacing.ml5]}
                source={{ uri: params.image }}
              ></Image>
            </View>

            <View style={[utilSpacing.px5, utilSpacing.mt8]}>
              <View>
                <Text size="xl" style={styles.chefName} preset="bold" text={params.name}></Text>
              </View>

              <View style={utilFlex.flexRow}>
                <Text numberOfLines={5} style={utilFlex.flex1} text={params.description}></Text>
              </View>
            </View>

            <View style={[utilSpacing.mt2, utilSpacing.pl5, utilSpacing.mt4]}>
              <Text text="Dias de entrega" preset="semiBold" style={utilSpacing.mb2}></Text>

              <View style={[utilFlex.flexRow, utilFlex.flexWrap]}>
                {days?.map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.day,
                      utilSpacing.px4,
                      utilSpacing.py2,
                      utilFlex.flex,
                      utilSpacing.mr3,
                      utilSpacing.mb3,
                    ]}
                  >
                    <Text text={day}></Text>
                  </View>
                ))}
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
            <View style={utilSpacing.mb6}>
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
        </View>
        <ModalCart chef={params} onContinue={toCheckout} modal={modalStateCart}></ModalCart>
        <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
        <ModalLeave modalState={modalStateLeave} onPressLeave={() => onPressLeave()}></ModalLeave>
      </>
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
  bgImage: {
    height: 150,
    position: "absolute",
    width: "100%",
    zIndex: 2,
  },
  btnBack: {
    backgroundColor: color.palette.white,
    borderRadius: 25,
    height: 45,

    position: "relative",

    width: 45,
    zIndex: 10,
    ...SHADOW,
  },
  card: {
    backgroundColor: color.background,
    borderRadius: spacing[2],
    margin: spacing[3],
    padding: spacing[3],
  },
  chefName: {
    fontSize: 24,
  },
  container: {
    backgroundColor: color.background,
    flex: 1,
    position: "relative",
  },
  containerBackground: {
    height: 150,
    width: "100%",
  },
  containerBtnBack: {
    left: 20,
    position: "absolute",
    top: 40,
    zIndex: 10,
  },

  containerSeparator: {
    alignItems: "center",
  },
  day: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.gray300,
    borderRadius: spacing[2],
  },
  iconBack: {
    marginLeft: 16,
    marginTop: 12,
  },
  imageChef: {
    borderColor: color.palette.white,
    borderRadius: 50,
    borderWidth: 2,
    bottom: -42,
    height: 85,
    position: "absolute",
    width: 85,
    zIndex: 3,
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
