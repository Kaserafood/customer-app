import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
import { Category } from "../../models/category-store"
import { Day } from "../../models/day-store"

import { UserChef } from "../../models/user-store/user-store"
import { DishChef } from "../../models/dish-store"

export interface User {
  id: number
  name: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

export type UserLoginResponse =
  | {
      kind: string
      data: {
        id: number
        username: string
        email: string
        displayName: string
      }
    }
  | GeneralApiProblem

export type DayResponse =
  | {
      kind: string
      data: Day[]
    }
  | GeneralApiProblem

export type CategoryResponse =
  | {
      kind: string
      data: Category[]
    }
  | GeneralApiProblem

export type DishResponse =
  | {
      kind: string
      data: DishChef[]
    }
  | GeneralApiProblem

export type ChefResponse =
  | {
      kind: string
      data: UserChef[]
    }
  | GeneralApiProblem
