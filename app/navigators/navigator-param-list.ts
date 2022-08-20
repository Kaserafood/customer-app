import { OrderOverview } from "../models"
import { Category } from "../models/category-store"
import { DishChef } from "../models/dish-store"

interface registerPageParams {
  init: boolean
}

interface addressScreenParams extends mapScreenParams {
  latitude: number
  longitude: number
  addressMap: string
  latitudeDelta: number
  longitudeDelta: number
  country: string
  city: string
  region: string
}

interface endOrderParams {
  orderId: number
  deliveryDate: string
  deliveryTime: string
  deliveryAddress: string
  imageChef: string
}

interface mapScreenParams {
  screenToReturn: "main" | "deliveryDetail"
}

interface tokenScreenParams {
  email: string
}

interface newPasswordScreenParams extends tokenScreenParams {}
interface MenuChef extends DishChef {
  isGetMenu?: boolean
}

interface loginFormParams {
  screenRedirect: "main" | "deliveryDetail"
}
export type NavigatorParamList = {
  init: undefined
  registerForm: undefined
  termsConditions: undefined
  privacyPolicy: undefined
  registerPager: registerPageParams
  loginForm: loginFormParams
  main: undefined
  dishDetail: DishChef
  menuChef: MenuChef
  deliveryDetail: undefined
  endOrder: endOrderParams
  category: Category
  home: undefined
  chefs: undefined
  search: undefined
  map: mapScreenParams
  address: addressScreenParams
  orders: undefined
  recoverPassword: undefined
  recoverPasswordToken: tokenScreenParams
  newPassword: newPasswordScreenParams
  account: undefined
  favorite: undefined
  newChefs: undefined
  orderDetail: OrderOverview
}
