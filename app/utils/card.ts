type CardType = "visa" | "mastercard" | "amex" | "unknown"
/* eslint-disable prefer-regex-literals */
export function getCardType(number: string): CardType {
  number = number.replace(/[ -]/g, "")
  // Visa
  let re = new RegExp("^4")
  if (number.match(re) != null) return "visa"

  // Mastercard
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number,
    )
  )
    return "mastercard"

  // American Express
  re = new RegExp("^3[47]")
  if (number.match(re) != null) return "amex"

  return "unknown"
}

// Add prefix to card number
export function getPrefixNumberCard(number: string): string {
  return `**** ${number}`
}
