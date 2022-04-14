import { showMessage } from "react-native-flash-message"
import { getI18nValue } from "./translate"

import { color } from "../theme"

export const handleDataResponseAPI = (response: any) => {
  if (response?.kind === "ok") {
    showMessage({
      message: response?.data?.message ?? getI18nValue("common.operationSuccess"),
      type: "success",
      position: "bottom",
      floating: true,
      icon: "auto",
    })
  } else {
    showMessage({
      style: { backgroundColor: color.palette.redDark },
      message: response?.data?.message ?? getI18nValue("common.someError"),
      type: "danger",
      position: "bottom",
      floating: true,
      icon: "auto",
    })
  }
}

export const showMessageInfo = (message: string) => {
  showMessage({
    message: getI18nValue("message"),
    type: "info",
    position: "bottom",
    floating: true,
    icon: "auto",
  })
}
