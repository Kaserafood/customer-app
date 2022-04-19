import { ApiResponse } from "apisauce"
import { Api } from "./api"

import { getGeneralApiProblem } from "./api-problem"
import { CategoryResponse } from "./api.types"

export class CategoryApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getAll(): Promise<CategoryResponse> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("/categories", {})

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
