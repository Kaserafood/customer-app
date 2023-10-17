import { Address, Coupon, Coverage, OrderDetail, OrderOverview } from "../../models"
import { Banner } from "../../models/banner-store"
import { Category } from "../../models/category-store"
import { Country } from "../../models/country-store"
import { Day, DeliveryTime } from "../../models/day-store"
import { DishChef } from "../../models/dish-store"
import { Account, Card, UserChef } from "../../models/user-store"

import { GeneralApiProblem } from "./api-problem"

type typeKind = "ok" | "bad-data"
export interface GeneralApiResponse {
  kind: typeKind
  data: any
}

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

type kind = {
  kind: typeKind
}
export type UserLoginResponse = {
  kind: typeKind
  data: {
    id: number
    username: string
    email: string
    displayName: string
    addressId: number
  }
}

export type DayResponse = {
  data: Day[]
} & kind

export type CategoryResponse = {
  data: Category[] | Category
} & kind

export interface DishResponse extends kind {
  data: DishChef | { dishes: DishChef[]; token: string }
}

export type ChefResponse = {
  data: UserChef[] | UserChef
} & kind

export type AddressResponse = {
  data: Address[]
} & kind

export type CommonResponse = {
  data: {
    message: string
    data: number | string // Usually contains the id inserted on the table
  }
} & kind

export type ValueResponse = {
  data: {
    value: string
  }
} & kind

export type OrderOverviewResponse = {
  data: OrderOverview[]
} & kind

export type OrderDetailResponse = {
  data: OrderDetail
} & kind

export type CoverageResponse = {
  data: Coverage[]
} & kind

export type CuponResponse = {
  data: Coupon
} & kind

export type BannerResponse = {
  data: Banner[]
} & kind

export type CardResponse = {
  data: Card[]
} & kind

export type CountryResponse = {
  data: Country[]
} & kind

export type DeliveryTimeResponse = {
  data: DeliveryTime[]
} & kind

export type SetupIntentResponse = {
  data: {
    customerSecret: string
  }
} & kind

interface Feature {
  value: number
  label: string
}

export type LunchesResponse = {
  data: {
    id: number
    name: string
    description: string
    recipeId: number
    image: string
    credits: number
    features: Feature[]
    amountPaymentKitchen: number
  }[]
} & kind

export type DatePlan = {
  dateNumber: number
  date: string
  dayShort: string
  dateNameLong: string
  dateNameShort: string
}

export type DatesPlansResponse = {
  data: DatePlan[]
} & kind

export type OrderPlanRequest = {
  userId: number
  totalCredits: number
  type: string
  amount: number
  expirationDate: string
  items: {
    recipeId: number
    deliveryDate: string
    credits: number
  }[]
  timeZone: string
  addressId: number
  noteDelivery?: string
  taxId?: string
  paymentMethodType: string
  paymentMethodStripeId?: number
  paymentMethodTokenId?: number | string
  coupon?: string
  amountCoupon?: number
  versionApp: string
  deviceType: string
  isSubscription?: boolean
  commentToChef?: string
  currencyCode: string
  deliveryPrice: number
  isCustom: boolean
}

export interface ReservationRequest {
  orderPlanId: number
  items: {
    recipeId: number
    quantity: number
    deliveryDate: string
    credits: number
  }[]
  timeZone: string
  userId: number
  commentToChef?: string
}

export type AccountResponse = {
  data: Account
} & kind

interface OrderChef {
  date: string
  dateName: string
  orders: OrderSummary[]
  isToday?: boolean
  isTomorrow?: boolean
}

interface OrderSummary {
  id: number
  code: string
  customerName: string
  deliveryTime: string
  total: number
  deliveryDate: string
  quantityItems: number
  status: string
}

export type OrdersChef = {
  data: OrderChef[]
} & kind

interface Product {
  itemId: number
  name: string
  price: number
  quantity: number
  image: string
  noteChef?: string
  addons: {
    key: string
    value: string
  }[]
}

interface OrderDetails {
  id: number
  code?: string
  createdDate: string
  status: string
  deliveryTime: string
  total: string
  deliveryDate: string
  statusName: string
  tax: string
  products: Product[]
  totalInvoice: number
  revenue: number
  noteChef?: string // This note just exists in packages not in individual dishes
  package?: {
    packages: {
      dishes: {
        id: number
        name: string
        accompaniments: string
        quantity: number
        comment: string
        price: number
      }[]
    }[]
  }
}

export type OrderDetailChef = {
  data: OrderDetails
} & kind
