import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const dependencies = types.model("DependenciesAddon", {
  hash: types.string,
  quantity: types.string,
})
export interface DependenciesAddon extends SnapshotIn<typeof dependencies> {}

export const option = types.model("Option").props({
  label: types.maybe(types.string),
  price: types.maybe(types.number),
  image: types.maybe(types.string),
  priceType: types.maybe(types.string),
  checked: types.maybe(types.boolean),
  disabled: types.maybe(types.boolean),
})

export const addonItem = types.model("AddonItem").props({
  name: types.maybe(types.string),
  value: types.maybe(types.number),
  price: types.maybe(types.number),
  total: types.maybe(types.number),
  label: types.maybe(types.string),
  min: types.maybe(types.number),
  checked: types.maybe(types.boolean),
  options: types.maybe(types.array(option)),
  dependencies: types.maybe(dependencies),
  type: types.maybe(types.string),
  incrementable: types.maybe(types.string),
  showTitle: types.maybe(types.string),
  optionBoolean: types.maybe(types.string),
  multipleChoice: types.maybe(types.string),
  required: types.maybe(types.number),
  hash: types.maybe(types.string),
  numOptionSelectables: types.maybe(types.number),
  hideInApp: types.maybe(types.string),
})

export const dish = types.model("Dish").props({
  id: types.maybe(types.number),
  title: types.maybe(types.string),
  description: types.maybe(types.string),
  price: types.maybe(types.number),
  image: types.maybe(types.string),
  imageThumbnail: types.maybe(types.string),
  addons: types.maybe(types.optional(types.array(addonItem), [])),
})
export interface Dish extends Instance<typeof dish> {}
