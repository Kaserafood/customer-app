import i18n from "i18n-js"
import * as RNLocalize from "react-native-localize"
import en from "./en.json"
import es from "./es.json"

i18n.fallbacks = true
i18n.translations = { es, en }

const supportedLanguages = {
  en: ["US"], // Map of countries where English is preferred
  es: ["MX", "GT"], // Map of countries where Spanish is preferred
}

const deviceCountry = RNLocalize.getCountry() // Get the current country

// Find the preferred language for the user's country
let preferredLanguage = "en" // Default language if no match is found

Object.entries(supportedLanguages).forEach(([language, countries]) => {
  if (countries.includes(deviceCountry)) {
    preferredLanguage = language
  }
})
console.log("preferredLanguage", preferredLanguage, deviceCountry)
i18n.locale = preferredLanguage
/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof es
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & string]

export function setLocaleI18n(locale: string) {
  console.log("setLocaleI18n", locale)
  i18n.locale = locale
}
