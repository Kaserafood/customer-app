import { applySnapshot, flow, Instance, types } from "mobx-state-tree"
import { isNumber } from "validate.js"

import { ChefResponse } from "../services/api"
import { Api } from "../services/api/api"
import { saveString } from "../utils/storage"

import { SetupIntent } from "../screens/checkout/modal-payment-stripe"
import { GUATEMALA } from "../utils/constants"
import { categoryStore } from "./category-store"
import { dish } from "./dish"
import { withEnvironment } from "./extensions/with-environment"

export const userChef = types.model("UserChef").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  categories: types.maybeNull(types.array(categoryStore)),
  dishes: types.optional(types.array(dish), []), // Only used when is grouped by chef
  currencyCode: types.maybeNull(types.string),
  priceDelivery: types.maybeNull(types.number),
})
export interface UserChef extends Instance<typeof userChef> {}

const userRegister = types.model("UserRegisterStore").props({
  name: types.maybeNull(types.string),
  lastName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  password: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
})
export interface UserRegister extends Instance<typeof userRegister> {}

const userLogin = types.model("UserLoginStore").props({
  email: types.maybeNull(types.string),
  password: types.maybeNull(types.string),
})
export interface UserLogin extends Instance<typeof userLogin> {}

const cardModel = types.model("Card").props({
  id: types.maybeNull(types.union(types.string, types.number)),
  name: types.maybeNull(types.string),
  number: types.maybeNull(types.string),
  expDate: types.optional(types.string, ""),
  type: types.maybeNull(types.string),
  selected: types.maybeNull(types.boolean),
})
export interface Card extends Instance<typeof cardModel> {}

// const plan = types.model("Plan").props({
//   id: types.number,
//   totalCredits: types.number,
//   type: types.string,
//   expirationDate: types.string,
//   creditsConsumed: types.number,
// })

const account = types.model("Account").props({
  currency: types.string,
  // plan: plan,
  date: types.string,
  role: types.maybeNull(types.string),
})
export interface Account extends Instance<typeof account> {}

export const UserRegisterModel = userRegister
  .props({
    userId: types.maybeNull(types.integer),
    displayName: types.maybeNull(types.string),
    addressId: types.maybeNull(types.number),
    taxId: types.maybeNull(types.string),
    customerNote: types.maybeNull(types.string),
    deliverySlotTime: types.maybeNull(types.string),
    cards: types.optional(types.array(cardModel), []),
    currentCard: types.maybe(cardModel),
    paymentCash: types.optional(types.boolean, false),
    isTester: types.maybeNull(types.boolean),
    countryId: types.maybeNull(types.number),
    account: types.maybeNull(account),
  })
  .extend(withEnvironment)
  .views((self) => ({
    get isNotSelectedCards() {
      return self.cards.filter((card) => card.selected).length === 0
    },
    isChef: () => {
      return self.account.role === "chef"
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
      if (card?.id) {
        console.log("card?.id", card?.id)
        self.paymentCash = false
      }

      if (card === null) {
        if (self.currentCard) {
          self.currentCard.expDate = ""
          self.currentCard.name = ""
          self.currentCard.number = ""
          self.currentCard.type = ""
          self.currentCard.id = 0
        }
      } else {
        self.paymentCash = false
        self.currentCard = { ...card }
      }
    },
    setCountryId: (countryId) => {
      self.countryId = countryId
      saveString("countryId", `${countryId}`)
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
      await saveString("countryId", `${data.countryId}`) // Delivery time slot of latest order created
      self.setUserId(data.id)
      self.setDisplayName(data.displayName)
      self.setEmail(data.email)
      self.setAddressId(data.addressId)
      self.setCountryId(data.countryId)
    },
  }))
  .actions((self) => ({
    register: async (user): Promise<number> => {
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

    validTokenRecoverPassword: flow(function* (token: string, email: string) {
      const api = new Api()

      const result = yield api.validTokenRecoverPassword(token, email)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),

    changePassword: flow(function* (email: string, password: string) {
      const api = new Api()

      const result = yield api.changePassword(email, password)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),
    removeAccount: flow(function* (userId: number) {
      const api = new Api()

      const result = yield api.removeAccount(userId)
      if (result && result.kind === "ok") {
        return true
      }
      return false
    }),
    reportBug: flow(function* (data: any) {
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

    getPaymentMethods: flow(function* (userId: number) {
      const api = new Api()
      let result: { kind: string; data: any }

      if (self.countryId === GUATEMALA) result = yield api.getPaymentMethodsQPayPro(userId)
      else result = yield api.getPaymentMethodsStripe(userId)
      if (result.kind === "ok") applySnapshot(self.cards, result.data)
    }),

    updateSelectedCard: flow(function* (userId: number, cardId: number | null | string) {
      const api = new Api()
      const result = yield api.updateSelectedCard(userId, cardId)
      if (result.kind === "ok") {
        if (isNumber(result.data.value) && Number(result.data.value) > 0) {
          return true
        }
      }
      return false
    }),

    addPaymentMethod: flow(function* (userId: number, card: any) {
      const api = new Api()
      let result: { kind: string; data: { value: any } }

      if (self.countryId === GUATEMALA) result = yield api.addPaymentMethodQPayPro(userId, card)
      else result = yield api.addPaymentMethodStripe(userId, self.email, card)

      if (result.kind === "ok") {
        if (
          self.countryId === GUATEMALA &&
          isNumber(result.data.value) &&
          Number(result.data.value) > 0
        ) {
          return true
        } else if (result.data.value) return true
      }
      return false
    }),
    addSetupIntent: flow(function* (dataIntent: SetupIntent) {
      const api = new Api()
      const result = yield api.createSetupIntent(self.userId, self.email, dataIntent)

      if (result.kind === "ok") {
        if (result.data.clientSecret) return result.data.clientSecret
        return null
      }
      return null
    }),

    getPublishableKey: flow(function* () {
      const api = new Api()
      const result = yield api.getPublishableKey()

      if (result.kind === "ok") {
        if (result.data.value) return result.data.value
        return null
      }
      return null
    }),

    addStripePaymentId: async (stripePaymentId: string, name: string) => {
      const userApi = new Api()
      const result = await userApi.addPaymentMethodId(stripePaymentId, name)

      if (result && result.kind === "ok") {
        return result.data.value
      }
      return 0
    },
    setAccount: (account: any) => {
      self.account = account
    },
    setPaymentCash: (paymentCash: boolean) => {
      self.currentCard = undefined
      self.paymentCash = paymentCash
    },
  }))
