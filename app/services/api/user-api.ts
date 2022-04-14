import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetCharactersResult, UserLoginResponse } from "./api.types"
import { getGeneralApiProblem, GeneralApiProblem } from "./api-problem"
import { IUserLogin, IUserRegister } from "../../models/user-store/user-store"

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async register(userRegisterStore: IUserRegister): Promise<UserLoginResponse> {
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

  async login(userLogin: IUserLogin): Promise<UserLoginResponse> {
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
