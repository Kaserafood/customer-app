export function getFormat(amount: number, currency = "GTQ"): string {
  const formatter = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: currency,
  })
  const format = formatter.format(amount)

  if (format.split(".")[1] === "00") {
    return format.split(".")[0]
  }

  return format
}
