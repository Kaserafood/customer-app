import * as RNLocalize from "react-native-localize"
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
  return mask.replaceAll("[", "").replaceAll("]", "").length
}
