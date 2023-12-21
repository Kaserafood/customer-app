import { applySnapshot, detach, flow, Instance, types } from "mobx-state-tree"
import { setLocaleI18n } from "../i18n"
import { Api, setLocale } from "../services/api"

const country = types.model("Country").props({
  id: types.number,
  name: types.string,
  code: types.string,
  flag: types.string,
  maskPhone: types.string,
  language: types.string,
  prefixPhone: types.string,
})

export interface Country extends Instance<typeof country> {}

export const CountryStoreModel = types
  .model("CountryStore")
  .props({
    countries: types.optional(types.array(country), []),
    selectedCountry: types.maybe(country),
  })
  .actions((self) => ({
    getAll: flow(function* () {
      detach(self.countries)
      const api = new Api()
      const result = yield api.getCountries()
      if (result && result.kind === "ok") {
        applySnapshot(self.countries, result.data)
        // const deviceCountry = RNLocalize.getCountry()

        self.selectedCountry = result.data[0]
        setLocaleI18n("es")
        setLocale("es")
        // if (result.data?.length > 0) {
        //   if (
        //     result.data.find(
        //       (c: Country) => c.code?.toLocaleLowerCase() === deviceCountry.toLocaleLowerCase(),
        //     )
        //   ) {
        //     self.selectedCountry = result.data.find(
        //       (c: Country) => c.code?.toLocaleLowerCase() === deviceCountry.toLocaleLowerCase(),
        //     )

        //     setLocaleI18n(self.selectedCountry.language.toLocaleLowerCase())
        //     setLocale(self.selectedCountry.language.toLocaleLowerCase())
        //   } else {
        //     self.selectedCountry = result.data[0]
        //     setLocaleI18n("es")
        //     setLocale("es")
        //   }
        // }
      }
    }),

    setSelectedCountry: (country) => {
      applySnapshot(self.selectedCountry, country)
    },
  }))
