import { Instance, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { UserApi } from "../../services/api/user-api"
import { handleDataResponseAPI } from "../../utils/messages"
import { UserLoginResponse } from "../../services/api/api.types"
import { saveString } from "../../utils/storage"

const userRegister = types.model("UserRegisterStore").props({
  name: types.maybe(types.string),
  lastName: types.maybe(types.string),
  email: types.maybe(types.string),
  password: types.maybe(types.string),
  phone: types.maybe(types.string),
})
export interface IUserRegister extends Instance<typeof userRegister> {}

const userLogin = types.model("UserLoginStore").props({
  email: types.maybe(types.string),
  password: types.maybe(types.string),
})
export interface IUserLogin extends Instance<typeof userLogin> {}

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
    register: async (user: IUserRegister) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.register(user)

      if (result.kind === "ok") {
        self.saveData(result)
        return result
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log("Error : " + result)
        return null
      }
    },

    login: async (user: IUserLogin) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.login(user)

      if (result.kind === "ok") {
        self.saveData(result)

        return result
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log("Error : " + result)
        return null
      }
    },
  }))
