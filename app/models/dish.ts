import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const dependencies = types.model("DependenciesAddon", {
  hash: types.string,
  quantity: types.string,
})
export interface DependenciesAddon extends SnapshotIn<typeof dependencies> {}

export const option = types.model("Option").props({
  label: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  image: types.maybeNull(types.string),
  priceType: types.maybeNull(types.string),
  checked: types.maybeNull(types.boolean),
  disabled: types.maybeNull(types.boolean),
})

export const addonItem = types.model("AddonItem").props({
  name: types.maybeNull(types.string),
  value: types.maybeNull(types.number),
  price: types.maybeNull(types.number),
  total: types.maybeNull(types.number),
  label: types.maybeNull(types.string),
  min: types.maybeNull(types.number),
  checked: types.maybeNull(types.boolean),
  options: types.maybeNull(types.array(option)),
  dependencies: types.maybeNull(dependencies),
  type: types.maybeNull(types.string),
  incrementable: types.maybeNull(types.string),
  showTitle: types.maybeNull(types.string),
  optionBoolean: types.maybeNull(types.string),
  multipleChoice: types.maybeNull(types.string),
  required: types.maybeNull(types.number),
  hash: types.maybeNull(types.string),
  numOptionSelectables: types.maybeNull(types.number),
  hideInApp: types.maybeNull(types.string),
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
