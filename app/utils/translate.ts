import { translate } from "../i18n"

export const getI18nValue = (text: string, txOptions?: any): string => {
  const i18nText = text && translate(text, txOptions ?? {})

  return i18nText ?? ""
}
