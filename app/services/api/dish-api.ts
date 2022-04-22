import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { DayResponse, DishResponse } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class DishApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getAll(date: string, timeZone: string, categoryId?: number): Promise<DishResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("/dishes", {
        date,
        timeZone,
        categoryId,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: [...response.data] }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getByChef(chefId: number): Promise<DishResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("/dishes/chefs/" + chefId)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok", data: [...response.data] }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
