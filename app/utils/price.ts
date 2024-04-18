export function getFormat(amount: number, currencyCode: string): string {
  let currency = "$"
  if (currencyCode === "GTQ") currency = "Q"

  if (!amount) return `${currency}0`

  let format = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")

  if (format.split(".")[1] === "00") {
    format = format.split(".")[0]
  }

  return `${currency}${format}`
}
