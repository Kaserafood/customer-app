import { translate } from "../i18n"

/**
 *
 * @param text text to translate
 * @param txOptions options to use for the translation
 * @returns {string}
 */
export const getI18nText = (text: string, txOptions?: any): string => {
  const i18nText = text && translate(text, txOptions ?? {})

  return i18nText ?? ""
}
