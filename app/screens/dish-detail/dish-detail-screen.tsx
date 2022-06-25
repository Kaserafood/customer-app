import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import {
  Addons,
  AutoImage,
  ButtonFooter,
  DishChef,
  getMetaData,
  Header,
  Icon,
  InputText,
  Loader,
  Price,
  Screen,
  Text,
} from "../../components"
import { Separator } from "../../components/separator/separator"
import { ItemCart } from "../../models/cart-store"
import { Addon } from "../../models/dish"
import { DishChef as DishChefModel } from "../../models/dish-store"
import { useStores } from "../../models/root-store/root-store-context"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getFormat } from "../../utils/price"
import { getI18nText } from "../../utils/translate"

export const DishDetailScreen: FC<StackScreenProps<NavigatorParamList, "dishDetail">> = observer(
  ({ navigation, route: { params } }) => {
    const [quantity, setQuantity] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalAddon, setTotalAddon] = useState(0)
    const [currentDish, setCurrentDish] = useState<DishChefModel>(params)
    const [addonsAvailable, setAddonsAvailable] = useState<Addon[]>([])
    const scrollRef = useRef<ScrollView>()
    const { ...methods } = useForm({ mode: "onBlur" })
    const { dishStore, commonStore, cartStore } = useStores()

    useEffect(() => {
      setAddonsAvailable(currentDish.addons.filter((addon) => addon.hide_in_app !== "yes"))
      setQuantity(1)
      setTotal(params.price)

      async function fetch() {
        if (commonStore.currentChefId !== params.chef.id) {
          commonStore.setCurrentChefId(params.chef.id)
          commonStore.setCurrentChefImage(params.chef.image)
          commonStore.setVisibleLoading(true)
          await dishStore.getByChef(params.chef.id).finally(() => {
            commonStore.setVisibleLoading(false)
          })
        }
      }

      fetch()
    }, [])

    useEffect(() => {
      setTotal((currentDish.price + totalAddon) * quantity)
    }, [quantity, totalAddon])

    const minusQuantity = (number: number) => {
      if (quantity > 1) {
        setQuantity(quantity - number)
      }
    }

    const onSubmit = (data) => {
      const itemCart: ItemCart = {
        dish: currentDish,
        quantity: quantity,
        noteChef: data.note,
        metaData: getMetaData(),
        total: total,
      }
      console.log(itemCart)
      cartStore.addItem(itemCart)
      methods.setValue("comment", "")
      setQuantity(1)
      navigation.navigate("menuChef", { ...params })
    }

    const changeDish = (dish: DishChefModel) => {
      if (currentDish.id !== dish.id) {
        setCurrentDish({ ...dish, chef: params.chef })
        setQuantity(1)
        setTotal(dish.price)
        setAddonsAvailable(dish.addons.filter((addon) => addon.hide_in_app !== "yes"))
        methods.setValue("comment", "")
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        })
      }
    }

    return (
      <Screen preset="fixed" style={styles.container}>
        <Header headerTx="dishDetailScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView ref={scrollRef} style={utilSpacing.p4}>
          <AutoImage style={styles.image} source={{ uri: currentDish.image }}></AutoImage>
          <View style={[utilFlex.flexRow, utilSpacing.my3, utilSpacing.mx4]}>
            <Text style={utilSpacing.mr3} text={currentDish.title} preset="bold"></Text>
          </View>
          <Text style={[utilSpacing.mb2, utilSpacing.mx4]} text={currentDish.description}></Text>
          <Price style={styles.price} amount={currentDish.price}></Price>

          {addonsAvailable.length > 0 ? (
            <Addons
              addons={addonsAvailable}
              onTotalPriceChange={(total) => setTotalAddon(total)}
            ></Addons>
          ) : (
            <Separator style={utilSpacing.my3}></Separator>
          )}

          <View style={[utilFlex.flexCenter, utilSpacing.mt5]}>
            <View style={styles.containerUnities}>
              <Text
                style={[styles.textUnities, utilSpacing.px3, utilSpacing.py4]}
                tx="dishDetailScreen.unities"
                preset="bold"
              ></Text>

              <TouchableOpacity activeOpacity={0.7} onPress={() => minusQuantity(1)}>
                <Ripple rippleCentered style={[utilSpacing.px4, utilSpacing.py4]}>
                  <Icon name="minus" size={12} color={color.palette.white}></Icon>
                </Ripple>
              </TouchableOpacity>
              <Text
                style={[styles.textUnities, styles.textCounter, utilText.textCenter]}
                text={`${quantity}`}
                preset="bold"
              ></Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setQuantity(quantity + 1)}>
                <Ripple rippleCentered style={[utilSpacing.px4, utilSpacing.py4]}>
                  <Icon name="plus" size={12} color={color.palette.white}></Icon>
                </Ripple>
              </TouchableOpacity>
            </View>
          </View>

          <View style={utilSpacing.mt4}>
            <FormProvider {...methods}>
              <InputText
                name="note"
                preset="card"
                labelTx="dishDetailScreen.commentChef"
                placeholderTx="dishDetailScreen.placeHolderCommetChef"
                counter={100}
              ></InputText>
            </FormProvider>
          </View>

          <View style={[utilSpacing.mt5, utilSpacing.mb3, utilFlex.flexRow]}>
            <Text size="lg" tx="dishDetailScreen.moreProductsChef" preset="bold"></Text>
            <Text size="lg" preset="bold" text={` ${currentDish.chef.name}`}></Text>
          </View>

          <ListDish onChangeDish={(dish) => changeDish(dish)} dishId={currentDish.id}></ListDish>
        </ScrollView>
        <ButtonFooter
          onPress={methods.handleSubmit(onSubmit)}
          text={`${getI18nText("dishDetailScreen.addToOrder")} ${getFormat(total)}`}
        ></ButtonFooter>
        <Loader></Loader>
      </Screen>
    )
  },
)

const ListDish = observer(
  (props: { onChangeDish: (dish: DishChefModel) => void; dishId: number }) => {
    const { dishStore } = useStores()
    return (
      <ScrollView horizontal style={utilSpacing.mb4}>
        {dishStore.dishesChef.map(
          (dish) =>
            props.dishId !== dish.id && (
              <DishChef
                onPress={() => props.onChangeDish(dish)}
                dish={dish}
                key={dish.id}
              ></DishChef>
            ),
        )}
      </ScrollView>
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
  buttonUnities: {
    backgroundColor: color.palette.grayLigth,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerUnities: {
    alignItems: "center",
    backgroundColor: color.primary,
    borderRadius: spacing[1],
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  iconCart: {
    height: 23,
    wdith: 23,
  },
  iconUnities: {
    height: 20,
    width: 20,
  },
  image: {
    borderRadius: spacing[2],
    height: 200,
    width: "100%",
  },
  price: {
    alignSelf: "flex-start",
    marginLeft: spacing[3],
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
  textCounter: {
    marginBottom: -2,
    minWidth: spacing[3],
  },
  textUnities: {
    color: color.palette.white,
  },
})
