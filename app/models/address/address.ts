import { Instance, SnapshotOut, types } from "mobx-state-tree"

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

  .actions((self) => ({}))
