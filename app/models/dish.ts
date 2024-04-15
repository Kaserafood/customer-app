import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const dependencies = types.model("DependenciesAddon", {
  hash: types.string,
  quantity: types.string,
})
export interface DependenciesAddon extends SnapshotIn<typeof dependencies> {}

export const option = types.model("Option").props({
  name: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  checked: types.maybeNull(types.boolean),
  disabled: types.maybeNull(types.boolean),
})

const type = types.model("type").props({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.string),
})

export const addonItem = types.model("AddonItem").props({
  id: types.string,
  title: types.maybeNull(types.string),
  value: types.maybe(types.number),
  price: types.maybeNull(types.number),
  total: types.maybeNull(types.number),
  label: types.maybeNull(types.string),
  initialValue: types.maybeNull(types.number),
  checked: types.maybeNull(types.boolean),
  multipleItems: types.maybeNull(types.array(option)),
  type: types.maybeNull(type),
  required: types.maybeNull(types.boolean),
  optionsQuantity: types.maybeNull(types.number),
})

export const dish = types.model("Dish").props({
  id: types.maybeNull(types.number),
  title: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  image: types.maybeNull(types.string),
  imageThumbnail: types.maybeNull(types.string),
  addons: types.maybeNull(types.optional(types.array(addonItem), [])),
})
export interface Dish extends Instance<typeof dish> {}
