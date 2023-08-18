import { OrderOverview } from "../models"
import { Category } from "../models/category-store"
import { DishChef } from "../models/dish-store"
import { UserChef } from "../models/user-store"

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
  screenToReturn: "main" | "checkout"
}

interface tokenScreenParams {
  email: string
}

interface newPasswordScreenParams extends tokenScreenParams {}
interface MenuChef extends UserChef {
  isGetMenu?: boolean
}

interface dishDetailProps extends DishChef {
  tempId?: string
  quantity?: number
  noteChef?: string
  timestamp?: number // Only used for update
}

interface loginFormParams {
  screenRedirect: "main" | "checkout"
}

interface menuChefProps extends MenuChef {
  showModalCart?: boolean
}

interface checkoutProps {}

export type NavigatorParamList = {
  init: undefined
  registerForm: undefined
  termsConditions: undefined
  privacyPolicy: undefined
  registerPager: registerPageParams
  loginForm: loginFormParams
  main: undefined
  dishDetail: dishDetailProps
  menuChef: menuChefProps
  checkout: checkoutProps
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
  reportBug: undefined
  plans: undefined
  formPlans: undefined
  subscription: undefined
  menu: undefined
}
