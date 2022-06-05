import { Address, OrderOverview } from "../../models"
import { Category } from "../../models/category-store"
import { Character } from "../../models/character/character"
import { Day } from "../../models/day-store"
import { DishChef } from "../../models/dish-store"
import { UserChef } from "../../models/user-store"
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

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

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
  data: Category[]
} & kind

export type DishResponse = {
  data: DishChef[]
} & kind

export type ChefResponse = {
  data: UserChef[]
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

export type OrderOverviewResponse = {
  data: OrderOverview[]
} & kind
