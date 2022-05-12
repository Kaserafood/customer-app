import { MessageOptions, showMessage } from "react-native-flash-message"
import { GeneralApiProblem } from "../services/api/api-problem"
import { color } from "../theme"
import { getI18nText } from "./translate"

const options: MessageOptions = {
  message: "",
  position: "bottom",
  floating: true,
  icon: "auto",
}
/**
 *
 * @param response response from the server
 *
 */
export const handleMessageProblem = (response: GeneralApiProblem) => {
  if (response.kind === "rejected") {
    if (response.data) {
      showMessage({
        style: { backgroundColor: color.primaryDarker },
        message: response?.data?.message ?? getI18nText("common.someError"),
        type: "danger",
        ...options,
      })
    } else showMessageError()
  } else if (response.kind === "cannot-connect") {
    showMessageError("common.cannotConnect")
  } else showMessageError()
}

/**
 *
 * @param message message to show, the value should be in i18n
 */

export const showMessageInfo = (message: string) => {
  showMessage({
    message: getI18nText(message),
    type: "info",
    ...options,
  })
}

/**
 *
 * @param message message to show, the value should be in i18n
 */

export const showMessageError = (message?: string) => {
  const msg = message ?? "common.someError"
  showMessage({
    style: { backgroundColor: color.primaryDarker },
    message: getI18nText("common.someError"),
    type: "danger",
    ...options,
  })
}
