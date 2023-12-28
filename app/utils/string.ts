import { getFormat } from "./price"

const replaceAll = (str: string, find: string, replace: string) => {
  return str.split(find).join(replace)
}

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

export const formatPhone = (number: string) => {
  if (!number || number.length === 0) return null

  let phone = replaceAll(number, "-", "")
  phone = replaceAll(phone, " ", "")
  phone = replaceAll(phone, "(", "")
  phone = replaceAll(phone, ")", "")

  if (phone.length === 8) phone = `+502${phone}`
  else phone = `+1${phone}`

  return null
}
