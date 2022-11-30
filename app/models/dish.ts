import { Instance, SnapshotIn, types } from "mobx-state-tree"

const dependencies = types.model("DependenciesAddon", {
  hash: types.string,
  quantity: types.string,
})

export const optionAddon = types.model("OptionAddon", {
  label: types.maybe(types.string),
  price: types.maybe(types.string),
  image: types.maybe(types.string),
  price_type: types.maybe(types.string),
})
export interface OptionAddon extends Instance<typeof optionAddon> {}

export const addon = types.model("Addons", {
  name: types.maybe(types.string),
  title_format: types.maybe(types.string),
  description_enable: types.maybe(types.number),
  description: types.maybe(types.string),
  type: types.maybe(types.string),
  display: types.maybe(types.string),
  position: types.maybe(types.number),
  required: types.maybe(types.number),
  restrictions: types.maybe(types.number),
  restrictions_type: types.maybe(types.string),
  adjust_price: types.maybe(types.number),
  price_type: types.maybe(types.string),
  price: types.maybe(types.string),
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  options: types.maybe(types.optional(types.array(optionAddon), [])),
  incrementable: types.maybe(types.string),
  label_option: types.maybe(types.string),
  show_title: types.maybe(types.string),
  option_boolean: types.maybe(types.string),
  multiple_choice: types.maybe(types.string),
  num_option_selectables: types.maybe(types.string),
  hide_in_app: types.maybe(types.string),
  dependencies: types.maybe(dependencies),
  hash: types.maybe(types.string),
})
export interface Addon extends SnapshotIn<typeof addon> {}

export const dish = types.model("Dish").props({
  id: types.maybe(types.number),
  title: types.maybe(types.string),
  description: types.maybe(types.string),
  price: types.maybe(types.number),
  image: types.maybe(types.string),
  imageThumbnail: types.maybe(types.string),
  addons: types.maybe(types.optional(types.array(addon), [])),
})
export interface Dish extends Instance<typeof dish> {}
