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
  isPlan?: boolean
}

interface mapScreenParams {
  screenToReturn: "main" | "checkout" | "menuSummary"
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

interface checkoutProps {
  isPlan?: boolean
  commentToChef?: string
}

interface orderPrepareDetailProps {
  id: number
}

interface ordersChefProps {
  timestamp?: number
}

interface dishesProps {
  showBackIcon?: boolean
}

interface plansProps {
  showBackIcon?: boolean
}

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
  plans: plansProps
  formPlans: undefined
  subscription: undefined
  menu: undefined
  menuSummary: undefined
  checkoutPlan: undefined
  ordersChef: ordersChefProps
  orderChefDetail: orderPrepareDetailProps
  dishes: dishesProps
}
