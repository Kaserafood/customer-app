import * as RNLocalize from "react-native-localize"

import { getCardType } from "./card"
export function getFormatMaskPhone(): string {
  const timeZone = RNLocalize.getTimeZone()
  // Mask from Guatemala
  let mask = "[0000]-[0000]"
  if (timeZone !== "America/Guatemala") {
    // Mask from Mexico
    mask = "[00]-[0000]-[0000]"
  }

  return mask
}

export function getMaskLength(mask: string): number {
  if (!mask) return 0
  return mask.split("[").join("").split("]").join("").length
}

export function getMaskCard(number: string) {
  const cardType = getCardType(number)
  let mask = ""
  switch (cardType) {
    case "visa":
    case "mastercard":
      mask = "[0000] [0000] [0000] [0000]"
      break
    case "amex":
      mask = "[0000] [000000] [00000]"
      break
    default:
      mask = "[0000] [0000] [0000] [0000]"
      break
  }

  return mask
}

export function getMaskCVV(number: string) {
  const cardType = getCardType(number)
  let mask = ""
  switch (cardType) {
    case "visa":
    case "mastercard":
      mask = "[000]"
      break
    case "amex":
      mask = "[0000]"
      break
    default:
      mask = "[000]"
      break
  }

  return mask
}
