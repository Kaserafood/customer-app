import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { DayResponse } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

export class DeliveryApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getDays(timeZone: string): Promise<DayResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("/deliveries/days", {
        timeZone,
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
}
