import { flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../../services/api"
import { AddressResponse, CommonResponse } from "../../services/api/api.types"

const addressModel = types.model("Address").props({
  id: types.maybe(types.number),
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number),
  longitudeDelta: types.maybe(types.number),
  latitudeDelta: types.maybe(types.number),
  addressMap: types.optional(types.maybeNull(types.string), null),
  address: types.maybe(types.string),
  numHouseApartment: types.optional(types.maybeNull(types.string), null),
  instructionsDelivery: types.optional(types.maybeNull(types.string), null),
  name: types.optional(types.maybeNull(types.string), null),
  phone: types.optional(types.maybeNull(types.string), null),
})
export interface Address extends SnapshotOut<typeof addressModel> {}
/**
 * Address model.
 */
export const AddressModelStore = types
  .model("Address")
  .props({
    addresses: types.optional(types.array(addressModel), []),
    current: types.optional(addressModel, {}),
  })
  .actions((self) => ({
    add: flow(function* add(address: Address) {
      const api = new Api()
      const result: CommonResponse = yield api.addAddress(address)

      if (result && result.kind === "ok") {
        address.id = Number(result.data.data)
        self.addresses.push(address)
        return result.data
      }
      return null
    }),
    getAll: flow(function* getAll(userId: number) {
      const api = new Api()
      const result: AddressResponse = yield api.getAddresses(userId)
      console.log("After request address:", result)
      if (result && result.kind === "ok") {
        self.addresses.replace(result.data)
      } else self.addresses.replace([])
    }),
    setCurrent(address: Address) {
      self.current = address
    },
  }))
