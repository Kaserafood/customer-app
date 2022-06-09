import { flow, Instance, types } from "mobx-state-tree"
import { Api } from "../services/api/api"
import { saveString } from "../utils/storage"
import { categoryStore } from "./category-store"
import { dish } from "./dish"
import { withEnvironment } from "./extensions/with-environment"

export const userChef = types.model("UserChef").props({
  id: types.maybe(types.number),
  name: types.maybe(types.string),
  image: types.maybe(types.string),
  description: types.maybe(types.string),
  categories: types.maybe(types.array(categoryStore)),
  dishes: types.optional(types.array(dish), []), // Only used when is grouped by chef
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

export const UserRegisterModel = userRegister
  .props({
    userId: types.maybe(types.integer),
    displayName: types.maybe(types.string),
    addressId: types.maybe(types.number),
    taxId: types.maybe(types.string),
    customerNote: types.maybe(types.string),
    deliverySlotTime: types.maybe(types.string),
  })
  .extend(withEnvironment)
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
    register: async (user: UserRegister) => {
      const userApi = new Api()
      const result = await userApi.register(user)

      if (result && result.kind === "ok") {
        self.saveData(result)
        return result
      }
      return null
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
      console.log(result)
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
  }))
