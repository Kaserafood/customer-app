import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { createContext, FC, useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BackHandler, ScrollView, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import IconRN from "react-native-vector-icons/FontAwesome"

import {
  Addons,
  ButtonFooter,
  DishChef,
  Header,
  Image,
  InputText,
  Price,
  Screen,
  Text,
} from "../../components"
import { Separator } from "../../components/separator/separator"
import { ItemCart } from "../../models/cart-store"
import { DishChef as DishChefModel } from "../../models/dish-store"
import { useStores } from "../../models/root-store/root-store-context"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getFormat } from "../../utils/price"
import { generateUUID } from "../../utils/security"
import { getI18nText } from "../../utils/translate"
import RNUxcam from "react-native-ux-cam"

export const AddonContext = createContext({
  currencyCode: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChangeScrollPosition: (position: number) => {},
})

export const DishDetailScreen: FC<StackScreenProps<NavigatorParamList, "dishDetail">> = observer(
  ({ navigation, route: { params } }) => {
    const [quantity, setQuantity] = useState(params.quantity ?? 1)
    const [total, setTotal] = useState(0)
    const [currentDish, setCurrentDish] = useState<DishChefModel>(params)
    const scrollRef = useRef<ScrollView>()
    const { ...methods } = useForm({ mode: "onBlur" })
    const { dishStore, commonStore, cartStore } = useStores()
    const [loading, setLoading] = useState(false)
    const [loadingDishes, setLoadingDishes] = useState(true)
    const { addonStore } = useStores()
    const [dishInfoHeight, setDishInfoHeight] = useState(0)

    useEffect(() => {
      const getDish = async () => {
        commonStore.setVisibleLoading(true)
        dishStore.getDish(params.id).then((res) => {
          if (res) {
            setCurrentDish(res)
            commonStore.setVisibleLoading(false)
            navigation.setParams({ ...res })
            RNUxcam.logEvent("dishDetail", {
              id: res.id,
              name: res.title,
              price: res.price,
              chefId: res.chef.id,
              chefName: res.chef.name,
            })
          }
        })
      }
      // No va venir el chef cuando se llega a esta pantalla desde el push notification
      if (!params.chef) {
        RNUxcam.tagScreenName("dishDetail")
        getDish()
      } else {
        RNUxcam.logEvent("dishDetail", {
          id: params.id,
          name: params.title,
          price: params.price,
          chefId: params.chef.id,
          chefName: params.chef.name,
        })
      }

      return () => {
        addonStore.detachAddons()
      }
    }, [])

    useEffect(() => {
      setCurrentDish(params)
    }, [params])

    useEffect(() => {
      async function fetch() {
        if (!dishStore.isUpdate) {
          setQuantity(1)
          setTotal(params.price)
          cartStore.setSubmited(false)
        }

        if (commonStore.currentChefId !== params.chef.id) {
          commonStore.setCurrentChefId(params.chef.id)
          commonStore.setCurrentChefImage(params.chef.image)
          setLoadingDishes(true)
          await dishStore.getByChef(params.chef.id).finally(() => {
            setLoadingDishes(false)
          })
        } else setLoadingDishes(false)
      }
      if (params.chef?.id > 0) fetch()
    }, [params.chef])

    useEffect(() => {
      if (params.addons) {
        if (dishStore.isUpdate) addonStore.setAddons(params.addons)
        else addonStore.initState(params.addons.filter((addon) => addon.hideInApp !== "yes"))
        __DEV__ && console.log("Addons", JSON.parse(JSON.stringify(addonStore.addons)))
      }
    }, [params.addons])

    useEffect(() => {
      setTotal((currentDish.price + addonStore.total) * quantity)
    }, [quantity, addonStore.total])

    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBack)

      return () => backHandler.remove()
    }, [navigation])

    useEffect(
      () =>
        navigation.addListener("beforeRemove", (e) => {
          e.preventDefault()
          if (e.data.action?.type === "GO_BACK" && dishStore.isUpdate) {
            navigation.navigate("menuChef", { ...currentDish.chef, showModalCart: true })
          } else navigation.dispatch(e.data.action)

          dishStore.setIsUpdate(false)
        }),
      [navigation],
    )

    useEffect(() => {
      if (dishStore.isUpdate) {
        setQuantity(params.quantity)
        methods.setValue("note", params.noteChef)
      }
    }, [params.timestamp])

    const handleBack = () => {
      goBack()
      return true
    }

    const minusQuantity = (number: number) => {
      if (quantity > 1) {
        setQuantity(quantity - number)
      }
    }

    const onSubmit = (data) => {
      if (!cartStore.isSubmited) cartStore.setSubmited(true)

      if (!isValidAddons()) {
        AppEventsLogger.logEvent("IntentAddToCart", 1, {
          content_type: "dish",
          dish_id: currentDish.id,
          quantity: quantity,
          total: total,
          dish: currentDish.title,
          description:
            "Se intentó agregar un producto al carrito pero algún complemento no fue seleccionado, por ende, no se agregó",
        })

        RNUxcam.logEvent("cantAddToCartByAddons", {
          id: currentDish.id,
          name: currentDish.title,
          price: currentDish.price,
          chefId: currentDish.chef.id,
          chefName: currentDish.chef.name,
          quantity,
          total,
        })

        return
      }

      cartStore.setSubmited(false)

      const itemCart: ItemCart = {
        tempId: dishStore.isUpdate ? params.tempId : generateUUID(),
        dish: currentDish,
        quantity: quantity,
        noteChef: data.note,
        metaData:
          addonStore.addons.length > 0 ? addonStore.getMetaData(currentDish.chef.currencyCode) : [],
        total: total,
        addons: JSON.stringify(addonStore.addons),
      }
      __DEV__ && console.log(itemCart)

      if (dishStore.isUpdate) cartStore.updateItem(itemCart)
      else cartStore.addItem(itemCart)

      methods.setValue("comment", "")
      setQuantity(1)
      AppEventsLogger.logEvent("AddToCart", 1, {
        content_type: "dish",
        dish_id: currentDish.id,
        dish: currentDish.title,
        quantity: quantity,
        total: total,
        description: "Se agregó un producto al carrito",
      })

      RNUxcam.logEvent("addToCart", {
        id: currentDish.id,
        name: currentDish.title,
        price: currentDish.price,
        chefId: currentDish.chef.id,
        chefName: currentDish.chef.name,
        quantity,
        total,
      })

      navigation.navigate("menuChef", { ...params.chef, showModalCart: true })
    }

    const isValidAddons = (): boolean => {
      return addonStore.isValidAddonsMultiChoice(addonStore.addons)
    }

    const changeDish = (dish: DishChefModel) => {
      setLoading(true)
      AppEventsLogger.logEvent("ChangeDishInDishDetail", 1, {
        content_type: "dish",
        dish_id: dish.id,
        dish_name: dish.title,
        description:
          "En el detalle del plato, donde se muestra 'Más productos del chef' se ha seleccionado otro producto",
      })
      if (currentDish.id !== dish.id) {
        setCurrentDish({ ...dish, chef: params.chef })
        setQuantity(1)
        setTotal(dish.price)
        addonStore.initState(dish.addons.filter((addon) => addon.hideInApp !== "yes"))
        methods.setValue("comment", "")
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        })

        RNUxcam.logEvent("changeDishInDetail", {
          id: dish.id,
          name: dish.title,
          price: dish.price,
          chefId: dish.chef.id,
          chefName: dish.chef.name,
        })
      }
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }

    const changeScrollPosition = (position: number) => {
      if (position > 0) {
        scrollRef.current?.scrollTo({
          x: 0,
          y: position + dishInfoHeight,
          animated: true,
        })
      }
    }

    const buttonCartText = () => {
      let text = ""
      if (dishStore.isUpdate) {
        text = getI18nText("dishDetailScreen.updateOrder")
      } else {
        text = getI18nText("dishDetailScreen.addToOrder")
      }
      return `${text} ${getFormat(total, currentDish.chef?.currencyCode)}`
    }

    if (!params.chef)
      return (
        <Screen preset="fixed">
          <Text text="No hay data de chef"></Text>
        </Screen>
      )

    return (
      <Screen preset="fixed" style={styles.container}>
        <Header headerTx="dishDetailScreen.title" leftIcon="back" onLeftPress={handleBack}></Header>
        <ScrollView ref={scrollRef}>
          <View
            style={[utilSpacing.mx5, utilSpacing.mt5]}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout
              setDishInfoHeight(height)
            }}
          >
            {loading ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={"100%"}>
                  <SkeletonPlaceholder.Item width={"100%"} height={230} borderRadius={8} />
                  <SkeletonPlaceholder.Item
                    marginTop={12}
                    width={"100%"}
                    height={20}
                    borderRadius={8}
                  />
                  <SkeletonPlaceholder.Item
                    marginTop={6}
                    width={"100%"}
                    height={40}
                    borderRadius={8}
                  />
                  <SkeletonPlaceholder.Item
                    marginTop={12}
                    width={50}
                    height={20}
                    borderRadius={8}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            ) : (
              <>
                <Image style={styles.image} source={{ uri: currentDish.image }}></Image>
                <View style={[utilFlex.flexRow, utilSpacing.my3]}>
                  <Text style={utilSpacing.mr3} text={currentDish.title} preset="bold"></Text>
                </View>
                <Text style={utilSpacing.mb2} text={currentDish.description}></Text>
                <Price
                  style={styles.price}
                  amount={currentDish.price}
                  currencyCode={currentDish.chef?.currencyCode}
                ></Price>
              </>
            )}
          </View>

          {addonStore.exitsAddons ? (
            <AddonContext.Provider
              value={{
                currencyCode: currentDish.chef?.currencyCode,
                onChangeScrollPosition: (position) => changeScrollPosition(position),
              }}
            >
              <Addons></Addons>
            </AddonContext.Provider>
          ) : (
            <Separator style={[utilSpacing.my3, utilSpacing.mx5]}></Separator>
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
                  <IconRN name="minus" size={16} color={color.palette.white}></IconRN>
                </Ripple>
              </TouchableOpacity>
              <Text
                style={[styles.textUnities, styles.textCounter, utilText.textCenter]}
                text={`${quantity}`}
                preset="bold"
              ></Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setQuantity(quantity + 1)}>
                <Ripple rippleCentered style={[utilSpacing.px4, utilSpacing.py4]}>
                  <IconRN name="plus" size={16} color={color.palette.white}></IconRN>
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

          <View style={[utilSpacing.mt5, utilSpacing.mb3, utilSpacing.ml5, utilFlex.flexRow]}>
            <Text size="lg" tx="dishDetailScreen.moreProductsChef" preset="bold"></Text>
            <Text size="lg" preset="bold" text={` ${currentDish.chef?.name}`}></Text>
          </View>
          {loadingDishes ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={"100%"} flexDirection="row" marginLeft={spacing[4]}>
                <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
                  <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
                  <SkeletonPlaceholder.Item
                    marginTop={10}
                    width={150}
                    height={16}
                    borderRadius={8}
                  />
                  <SkeletonPlaceholder.Item
                    alignSelf="flex-end"
                    marginTop={6}
                    width={50}
                    height={16}
                    borderRadius={24}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
                  <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
                  <SkeletonPlaceholder.Item
                    marginTop={10}
                    width={150}
                    height={16}
                    borderRadius={8}
                  />
                  <SkeletonPlaceholder.Item
                    alignSelf="flex-end"
                    marginTop={6}
                    width={50}
                    height={16}
                    borderRadius={24}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
                  <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
                  <SkeletonPlaceholder.Item
                    marginTop={10}
                    width={150}
                    height={16}
                    borderRadius={8}
                  />
                  <SkeletonPlaceholder.Item
                    alignSelf="flex-end"
                    marginTop={6}
                    width={50}
                    height={16}
                    borderRadius={24}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ) : (
            <View>
              <ListDish
                currencyCode={currentDish.chef?.currencyCode}
                onChangeDish={(dish) => changeDish(dish)}
                dishId={currentDish.id}
              ></ListDish>
            </View>
          )}
        </ScrollView>
        <ButtonFooter
          onPress={methods.handleSubmit(onSubmit)}
          text={buttonCartText()}
        ></ButtonFooter>
      </Screen>
    )
  },
)

const ListDish = observer(
  (props: {
    onChangeDish: (dish: DishChefModel) => void
    dishId: number
    currencyCode: string
  }) => {
    const { dishStore } = useStores()
    return (
      <ScrollView horizontal style={[utilSpacing.mb4, utilSpacing.ml5]}>
        {dishStore.dishesChef.map(
          (dish) =>
            props.dishId !== dish.id && (
              <DishChef
                onPress={() => props.onChangeDish(dish)}
                dish={dish}
                key={dish.id}
                currencyCode={props.currencyCode}
              ></DishChef>
            ),
        )}
      </ScrollView>
    )
  },
)

const styles = StyleSheet.create({
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
  image: {
    borderRadius: spacing[2],
    height: 230,
    width: "100%",
  },
  price: {
    alignSelf: "flex-start",
  },
  textCounter: {
    marginBottom: -2,
    minWidth: spacing[3],
  },
  textUnities: {
    color: color.palette.white,
  },
})
