import { applySnapshot, detach, flow, Instance, types } from "mobx-state-tree"
import { Api } from "../services/api"

const country = types.model("Country").props({
  id: types.number,
  name: types.maybeNull(types.string),
  flag: types.maybeNull(types.string),
  maskPhone: types.string,
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
        if (result.data.length > 0) self.selectedCountry = result.data[0]
      }
    }),

    setSelectedCountry: (country) => {
      applySnapshot(self.selectedCountry, country)
    },
  }))
