import { StackScreenProps } from "@react-navigation/stack"
import images from "assets/images"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import SvgUri from "react-native-svg-uri"
import {
  AutoImage,
  EmptyData,
  Header,
  ModalCart,
  Price,
  Screen,
  Separator,
  Text,
} from "../../components"
import { DayDelivery } from "../../components/day-delivery/day-delivery"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"
import { Dish } from "../../models/dish-store"
import { goBack, NavigatorParamList } from "../../navigators"
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
    const { dayStore, modalStore, dishStore, cartStore } = useStores()

    useEffect(() => {
      console.log(params)
    })

    const onChangeDay = async (day: Day) => {
      modalStore.setVisibleLoading(true)
      dayStore.setCurrentDay(day)
      await dishStore.getByChef(params.chef.id).finally(() => {
        modalStore.setVisibleLoading(false)
      })
    }

    const toDishDetail = (dish: Dish) => {
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
          <View style={utilSpacing.pl4}>
            <DayDelivery
              days={dayStore.days}
              hideWhyButton
              onPress={(day) => {
                onChangeDay(day)
              }}
            ></DayDelivery>
          </View>

          <View style={styles.card}>
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
            <Text
              preset="semiBold"
              style={utilText.textGray}
              text={getCategoriesName(params.chef.categories)}
            ></Text>
            <Price amount={30} style={utilSpacing.mt3} preset="delivery"></Price>
          </View>
          <View style={utilSpacing.m4}>
            <Text
              preset="bold"
              size="lg"
              tx="menuChefScreen.all"
              style={styles.textSeparator}
            ></Text>
            <Separator style={utilSpacing.mt4}></Separator>
          </View>
          <View style={utilSpacing.mb6}>
            {dishStore.dishesChef.map((dish) => (
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                onPress={() => toDishDetail(dish)}
                key={dish.id}
                style={[styles.card, utilFlex.flexRow, utilSpacing.mb1]}
              >
                <View style={[utilFlex.flex1, utilSpacing.mr3]}>
                  <Text numberOfLines={1} text={dish.title} preset="bold"></Text>
                  <Text numberOfLines={3} text={dish.description} style={utilText.textGray}></Text>

                  <Price style={styles.price} amount={dish.price}></Price>
                </View>
                <View>
                  <AutoImage source={{ uri: dish.image }} style={styles.imageDish}></AutoImage>
                </View>
              </Ripple>
            ))}
          </View>
          <EmptyData lengthData={dishStore.dishesChef.length}></EmptyData>
        </ScrollView>
        {cartStore.hasItems && (
          <TouchableOpacity
            onPress={() => modalState.setVisible(true)}
            activeOpacity={0.7}
            style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
          >
            <SvgUri height={35} width={35} source={images.cart}></SvgUri>
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
    backgroundColor: color.palette.white,
    borderRadius: spacing[2],
    margin: spacing[3],
    padding: spacing[3],
    ...SHADOW,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerSeparator: {
    alignItems: "center",
  },
  imageChef: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  imageDish: {
    borderRadius: spacing[2],
    height: 100,
    width: 150,
  },
  price: {
    bottom: 0,
    left: 0,
    position: "absolute",
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
