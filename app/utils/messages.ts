import { showMessage } from "react-native-flash-message"
import { getI18nText } from "./translate"
import { color } from "../theme"

/**
 *
 * @param response response from the server
 *
 */
export const handleDataResponseAPI = (response: any) => {
  if (response?.kind === "ok") {
    showMessage({
      message: response?.data?.message ?? getI18nText("common.operationSuccess"),
      type: "success",
      position: "bottom",
      floating: true,
      icon: "auto",
    })
  } else {
    showMessage({
      style: { backgroundColor: color.palette.redDark },
      message: response?.data?.message ?? getI18nText("common.someError"),
      type: "danger",
      position: "bottom",
      floating: true,
      icon: "auto",
    })
  }
}

/**
 *
 * @param message message to show, the value should be in i18n
 */

export const showMessageInfo = (message: string) => {
  showMessage({
    message: getI18nText(message),
    type: "info",
    position: "bottom",
    floating: true,
    icon: "auto",
  })
}

/**
 *
 * @param message message to show, the value should be in i18n
 */

export const showMessageError = (message: string) => {
  showMessage({
    message: getI18nText(message),
    type: "danger",
    position: "bottom",
    floating: true,
    icon: "auto",
  })
}
