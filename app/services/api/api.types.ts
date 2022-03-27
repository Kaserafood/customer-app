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


export interface Customer {
  id : number,
  name: string,
  username: string,
  email: string,
  address: {
    street: string,
    suite: string,
    city: string,
    zipcode: string
  },
  phone: string,
  website: string,

}
export type GetCustomersResult = { kind: "ok"; customers: Customer[] } | GeneralApiProblem
export type GetCustomerResult = { kind: "ok"; customer: Customer } | GeneralApiProblem
