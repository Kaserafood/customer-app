import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"

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

export interface Day {
  dayName: string
  date: string
}
export type DayResponse =
  | {
      kind: string
      data: Day[]
    }
  | GeneralApiProblem
