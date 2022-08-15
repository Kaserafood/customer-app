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
      const msg = response?.data?.message ?? getI18nText("common.someError")
      showMessageError(msg)
    } else showMessageError()
  } else if (response.kind === "cannot-connect") {
    showMessageError(getI18nText("common.cannotConnect"))
  } else showMessageError()
}

/**
 *
 * @param message message to show
 * @param isI18n if true, message is a key to translate
 */
export const showMessageInfo = (message: string, isI18n = false) => {
  let msg = ""
  if (isI18n) msg = getI18nText(message)
  else msg = message ?? getI18nText("common.operationExecuted")
  showMessage({
    ...options,
    message: msg,
    type: "info",
  })
}

/**
 *
 * @param message message to show
 * @param isI18n if true, message is a key to translate
 */
export const showMessageError = (message?: string, isI18n = false) => {
  let msg = ""
  if (isI18n) msg = getI18nText(message)
  else msg = message ?? getI18nText("common.someError")
  showMessage({
    ...options,
    style: { backgroundColor: color.primaryDarker },
    message: msg,
    type: "danger",
  })
}

/**
 *
 * @param message message to show
 * @param isI18n if true, message is a key to translate
 */
export const showMessageSucess = (message?: string, isI18n = false) => {
  let msg = ""
  if (isI18n) msg = getI18nText(message)
  else message ?? getI18nText("common.operationSuccess")
  showMessage({
    ...options,
    style: { backgroundColor: color.palette.green },
    message: msg,
    type: "success",
  })
}
