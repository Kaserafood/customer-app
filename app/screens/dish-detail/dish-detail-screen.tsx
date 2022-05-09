import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import {
  AutoImage,
  DishChef,
  Header,
  Icon,
  InputTextCard,
  Loader,
  Price,
  Screen,
  Text,
} from "../../components"
import { Separator } from "../../components/separator/separator"
import { DishChef as DishChefModel } from "../../models/dish-store"
import { useStores } from "../../models/root-store/root-store-context"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getFormat } from "../../utils/price"

export const DishDetailScreen: FC<StackScreenProps<NavigatorParamList, "dishDetail">> = observer(
  ({ navigation, route: { params } }) => {
    const [quantity, setQuantity] = useState(1)
    const [total, setTotal] = useState(0)
    const [comment, setComment] = useState("")
    const [currentDish, setCurrentDish] = useState<DishChefModel>(params)
    const scrollRef = useRef<ScrollView>()

    const { dishStore, modalStore, cartStore } = useStores()

    useEffect(() => {
      setQuantity(1)
      setTotal(params.price)
      console.log(params)
      async function fetch() {
        modalStore.setVisibleLoading(true)
        await dishStore.getByChef(params.chef.id).finally(() => {
          modalStore.setVisibleLoading(false)
        })
      }

      fetch()
    }, [])

    useEffect(() => {
      setTotal(params.price * quantity)
    }, [quantity])

    const minusQuantity = (number: number) => {
      if (quantity > 1) {
        setQuantity(quantity - number)
      }
    }

    const addToCart = () => {
      cartStore.addItem(currentDish, quantity, comment)
      setComment("")
      setQuantity(1)
      navigation.navigate("menuChef", { ...params })
    }

    const changeDish = (dish: DishChefModel) => {
      if (currentDish.id !== dish.id) {
        setCurrentDish({ ...dish, chef: params.chef })
        setComment("")
        setQuantity(1)
        setTotal(dish.price)

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
          <Separator style={utilSpacing.my3}></Separator>

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

          <InputTextCard
            style={utilSpacing.m4}
            titleTx="dishDetailScreen.commentChef"
            placeholderTx="dishDetailScreen.placeHolderCommetChef"
            counter={100}
            value={comment}
            onChangeText={(value) => setComment(value)}
          ></InputTextCard>
          <View style={[utilSpacing.mt5, utilSpacing.mb3, utilFlex.flexRow]}>
            <Text size="lg" tx="dishDetailScreen.moreProductsChef" preset="bold"></Text>
            <Text size="lg" preset="bold" text={` ${currentDish.chef.name}`}></Text>
          </View>

          <ScrollView horizontal style={utilSpacing.mb4}>
            {dishStore.dishesChef.map((dish) => (
              <DishChef onPress={() => changeDish(dish)} dish={dish} key={dish.id}></DishChef>
            ))}
          </ScrollView>
        </ScrollView>
        <TouchableOpacity
          onPress={addToCart}
          activeOpacity={0.7}
          style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
        >
          <Icon name="cart" size={30} color={color.palette.white}></Icon>
          <Text
            preset="semiBold"
            style={[styles.textAddToOrder, utilSpacing.mx3]}
            tx="dishDetailScreen.addToOrder"
          ></Text>
          <Text preset="semiBold" style={styles.textAddToOrder} text={`${getFormat(total)}`}></Text>
        </TouchableOpacity>

        <Loader></Loader>
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
