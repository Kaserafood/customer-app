import { flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../../services/api"
import { AddressResponse, CommonResponse } from "../../services/api/api.types"

const addressModel = types.model("Address").props({
  id: types.maybe(types.number),
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number),
  longitudeDelta: types.maybe(types.number),
  latitudeDelta: types.maybe(types.number),
  addressMap: types.maybe(types.string),
  address: types.maybe(types.string),
  numHouseApartment: types.maybe(types.string),
  instructionsDelviery: types.maybe(types.string),
  name: types.maybe(types.string),
  phone: types.maybe(types.string),
})
export interface Address extends SnapshotOut<typeof addressModel> {}
/**
 * Address model.
 */
export const AddressModelStore = types
  .model("Address")
  .props({
    addresses: types.optional(types.array(addressModel), []),
  })
  .actions((self) => ({
    add: flow(function* add(address: Address) {
      const api = new Api()
      const result: CommonResponse = yield api.addAddress(address)

      if (result && result.kind === "ok") {
        self.addresses.push(address)
        return result.data
      }
      return null
    }),
    getAll: flow(function* getAll(userId: number) {
      const api = new Api()
      const result: AddressResponse = yield api.getAddresses(userId)

      if (result && result.kind === "ok") {
        self.addresses.replace(result.data)
        return result.data
      }
      return null
    }),
  }))
