import { Category } from "../models/category-store"
import { DishChef } from "../models/dish-store"

interface registerPageParams {
  init: boolean
}

interface addressScreenParams {
  latitude: number
  longitude: number
  addressMap: string
  latitudeDelta: number
  longitudeDelta: number
}

interface endOrderParams {
  orderId: number
  deliveryDate: string
  deliveryTime: string
  deliveryAddress: string
  imageChef: string
}

export type NavigatorParamList = {
  init: undefined
  registerForm: undefined
  termsConditions: undefined
  privacyPolicy: undefined
  registerPager: registerPageParams
  loginForm: undefined
  main: undefined
  dishDetail: DishChef
  menuChef: DishChef
  deliveryDetail: undefined
  endOrder: endOrderParams
  category: Category
  home: undefined
  chefs: undefined
  search: undefined
  map: undefined
  address: addressScreenParams
}
