import { GeneralApiProblem } from "../services/api/api-problem"
import { getI18nText } from "./translate"

/**
 *
 * @param response response from the server
 *
 */
export const handleMessageProblem = (response: GeneralApiProblem) => {
  if (response.kind === "rejected") {
    if (response.data) {
      const msg = response?.data?.message ?? getI18nText("common.someError")
      throw new Error(msg)
    } else throw new Error()
  } else if (response.kind === "cannot-connect") {
    throw new Error(getI18nText("common.cannotConnect"))
  } else throw new Error()
}
