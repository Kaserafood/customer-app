import { getFormat } from "./price"

export const getLabelMetaCart = (value, label, total, currencyCode) => {
  let result = ""
  if (Number(value ?? 0) > 0) {
    result += value
  }

  if (label) result += ` ${label}`

  if (Number(total ?? 0) > 0) {
    result += ` ( +${getFormat(total, currencyCode)} )`
  }

  return result 
}
