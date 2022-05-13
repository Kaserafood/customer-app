import * as RNLocalize from "react-native-localize"
export function getFormat(amount: number): string {
  const timeZone = RNLocalize.getTimeZone()
  let currency = "Q"
  if (timeZone !== "America/Guatemala") {
    currency = "$"
  }

  let format = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")

  if (format.split(".")[1] === "00") {
    format = format.split(".")[0]
  }

  return `${currency} ${format}`
}
