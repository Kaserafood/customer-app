import { Instance, types } from "mobx-state-tree"
import { UserApi } from "../services/api/user-api"
import { handleDataResponseAPI } from "../utils/messages"
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
  .extend(withEnvironment)
  .actions(() => ({
    saveData: async (result) => {
      const { data } = result
      await saveString("userId", data.id.toString())
      await saveString("email", data.email)
      await saveString("displayName", data.displayName)
    },
  }))
  .actions((self) => ({
    register: async (user: UserRegister) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.register(user)

      if (result.kind === "ok") {
        self.saveData(result)
        return result
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log(`Error : ${result}`)
        return null
      }
    },

    login: async (user: UserLogin): Promise<boolean> => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.login(user)

      if (result.kind === "ok") {
        self.saveData(result)

        return true
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log(`Error : ${result}`)
        return false
      }
    },
  }))
