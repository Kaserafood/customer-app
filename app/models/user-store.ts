import { action } from "mobx"
import { flow, Instance, types } from "mobx-state-tree"
import { isNumber } from "validate.js"

import { ChefResponse } from "../services/api"
import { Api } from "../services/api/api"
import { saveString } from "../utils/storage"

import { withEnvironment } from "./extensions/with-environment"
import { categoryStore } from "./category-store"
import { dish } from "./dish"

export const userChef = types.model("UserChef").props({
  id: types.maybe(types.number),
  name: types.maybe(types.string),
  image: types.maybe(types.string),
  description: types.maybe(types.string),
  categories: types.maybe(types.array(categoryStore)),
  dishes: types.optional(types.array(dish), []), // Only used when is grouped by chef
  currencyCode: types.maybe(types.string),
})
export interface UserChef extends Instance<typeof userChef> {}

const userRegister = types.model("UserRegisterStore").props({
  name: types.maybe(types.string),
  lastName: types.maybe(types.string),
  email: types.maybe(types.string),
  password: types.maybe(types.string),
  phone: types.maybe(types.string),
})
export interface UserRegister extends Instance<typeof userRegister> {}

const userLogin = types.model("UserLoginStore").props({
  email: types.maybe(types.string),
  password: types.maybe(types.string),
})
export interface UserLogin extends Instance<typeof userLogin> {}

const cardModel = types.model("Card").props({
  id: types.maybe(types.number),
  name: types.maybe(types.string),
  number: types.maybe(types.string),
  expDate: types.optional(types.string, ""),
  type: types.maybe(types.string),
  selected: types.maybe(types.boolean),
})
export interface Card extends Instance<typeof cardModel> {}

export const UserRegisterModel = userRegister
  .props({
    userId: types.maybe(types.integer),
    displayName: types.maybe(types.string),
    addressId: types.maybe(types.number),
    taxId: types.maybe(types.string),
    customerNote: types.maybe(types.string),
    deliverySlotTime: types.maybe(types.string),
    cards: types.optional(types.array(cardModel), []),
    currentCard: types.maybe(cardModel),
  })
  .extend(withEnvironment)
  .views((self) => ({
    get isNotSelectedCards() {
      return self.cards.filter((card) => card.selected).length === 0
    },
  }))
  .actions((self) => ({
    setUserId: (userId: number) => {
      self.userId = userId
    },
    setDisplayName: (displayName: string) => {
      self.displayName = displayName
    },
    setEmail: (email: string) => {
      self.email = email
    },
    setAddressId: (addressId: number) => {
      self.addressId = addressId
    },
    setCards: (cards: any) => {
      self.cards = cards
    },
    setCurrentCard: (card: Card | null) => {
      if (card === null) {
        if (self.currentCard) {
          self.currentCard.expDate = ""
          self.currentCard.name = ""
          self.currentCard.number = ""
          self.currentCard.type = ""
          self.currentCard.id = 0
        }
      } else self.currentCard = { ...card }
    },
  }))
  .actions((self) => ({
    saveData: async (result) => {
      const { data } = result
      await saveString("userId", data.id.toString())
      await saveString("email", data.email)
      await saveString("displayName", data.displayName)
      await saveString("addressId", data.addressId.toString()) // Address id of latest address selected
      await saveString("taxId", data.taxId) // Tax id of latest order created
      await saveString("customerNote", data.customerNote) // Customer note of latest order created
      await saveString("deliveryTimeSlot", data.deliveryTimeSlot) // Delivery time slot of latest order created
      self.setUserId(data.id)
      self.setDisplayName(data.displayName)
      self.setEmail(data.email)
      self.setAddressId(data.addressId)
    },
  }))
  .actions((self) => ({
    register: async (user: UserRegister): Promise<number> => {
      const userApi = new Api()
      const result = await userApi.register(user)

      if (result && result.kind === "ok") {
        await self.saveData(result)
        return result.data.id
      }
      return 0
    },

    login: async (user: UserLogin): Promise<boolean> => {
      const userApi = new Api()
      const result = await userApi.login(user)

      if (result && result.kind === "ok") {
        await self.saveData(result)
        return true
      }
      return false
    },

    updateAddresId: flow(function* updateAddresId(userId: number, addressId: number) {
      const api = new Api()

      const result = yield api.updateAddressId(userId, addressId)
      __DEV__ && console.log(result)
    }),

    sendEmailRecoverPassword: flow(function* sendEmailRecoverPassword(email: string) {
      const api = new Api()

      const result = yield api.sendEmailRecoverPassword(email)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),

    validTokenRecoverPassword: flow(function* validTokenRecoverPassword(
      token: string,
      email: string,
    ) {
      const api = new Api()

      const result = yield api.validTokenRecoverPassword(token, email)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),

    changePassword: flow(function* changePassword(email: string, password: string) {
      const api = new Api()

      const result = yield api.changePassword(email, password)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),
    removeAccount: flow(function* removeAccount(userId: number) {
      const api = new Api()

      const result = yield api.removeAccount(userId)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),
    reportBug: flow(function* reportBug(data: any) {
      const api = new Api()

      const result = yield api.reportBug(data)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),
    getInfoChef: flow(function* getInfoChefs(
      chefId: number,
    ): Generator<any, UserChef, ChefResponse> {
      const api = new Api()
      const result = yield api.getInfoChef(chefId)
      if (result.kind === "ok") return result.data as UserChef

      return null
    }),

    getCads: flow(function* getCards(userId: number) {
      const api = new Api()
      const result = yield api.getCards(userId)
      if (result.kind === "ok") self.setCards(result.data)
    }),

    updateSelectedCard: flow(function* updateSelectedCard(userId: number, cardId: number | null) {
      const api = new Api()
      const result = yield api.updateSelectedCard(userId, cardId)
      if (result.kind === "ok") {
        if (isNumber(result.data.value) && Number(result.data.value) > 0) {
          return true
        }
      }
      return false
    }),

    addCard: flow(function* addCard(userId: number, card: any) {
      const api = new Api()
      const result = yield api.addCard(userId, card)
      if (result.kind === "ok") {
        if (isNumber(result.data.value) && Number(result.data.value) > 0) {
          return true
        }
      }
      return false
    }),
  }))
