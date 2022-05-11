import { ApiResponse } from "apisauce"
import { UserLogin, UserRegister } from "../../models/user-store"
import { Api } from "./api"
import { getGeneralApiProblem } from "./api-problem"
import { UserLoginResponse } from "./api.types"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async register(userRegisterStore: UserRegister): Promise<UserLoginResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/users/register", {
        ...userRegisterStore,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: { ...response.data } }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async login(userLogin: UserLogin): Promise<UserLoginResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.post("/users/login", {
        ...userLogin,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: { ...response.data } }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
