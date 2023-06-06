import { Linking, Platform } from "react-native"
import { getI18nText } from "./translate"
import { TxKeyPath } from "../i18n"

const openWhatsApp = (message: TxKeyPath) => {
  const phoneWithCountryCode = "50245680417"

  const mobile = Platform.OS === "ios" ? phoneWithCountryCode : `+${phoneWithCountryCode}`
  const msg = getI18nText(message)
  Linking.openURL(`whatsapp://send?text=${msg}&phone=${mobile}`).catch(() => {
    alert("Asegúrese de que WhatsApp esté instalado en su dispositivo")
  })
}

export { openWhatsApp }
