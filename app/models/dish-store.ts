import { types, Instance, SnapshotIn } from "mobx-state-tree"
import { withEnvironment } from "./extensions/with-environment"

import { handleDataResponseAPI } from "../utils/messages"
import { userChef } from "./user-store/user-store"
import { DishApi } from "../services/api/dish-api"

const option = types.model("OptionAddon", {
  label: types.maybe(types.string),
  price: types.maybe(types.string),
  image: types.maybe(types.string),
  price_type: types.maybe(types.string),
})

const addons = types.model("Addons", {
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
  options: types.maybe(types.optional(types.array(option), [])),
})

export const dishStore = types.model("DishStore").props({
  id: types.maybe(types.number),
  title: types.maybe(types.string),
  description: types.maybe(types.string),
  price: types.maybe(types.number),
  image: types.maybe(types.string),
  addons: types.maybe(types.optional(types.array(addons), [])),
  chef: types.maybe(userChef),
})

export interface Dish extends Instance<typeof dishStore> {}

export const DishStoreModel = types
  .model("DishStoreModel")
  .props({
    dishes: types.optional(types.array(dishStore), []),
    dishesCategory: types.optional(types.array(dishStore), []),
    dishesChef: types.optional(types.array(dishStore), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setDishes: async (dishes: Dish[]) => {
      self.dishes.replace(dishes)
    },
    setDishesCategory: async (dishes: Dish[]) => {
      self.dishesCategory.replace(dishes)
    },
    setDishesChef: async (dishes: Dish[]) => {
      self.dishesChef.replace(dishes)
    },
  }))
  .actions((self) => ({
    getAll: async (date: string, timeZone: string, categoryId?: number) => {
      const api = new DishApi(self.environment.api)

      const result = await api.getAll(date, timeZone, categoryId)

      if (result.kind === "ok") {
        if (categoryId) self.setDishesCategory(result.data)
        else self.setDishes(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log(`Error : ${result}`)
      }
    },
    getByChef: async (chefId: number) => {
      const api = new DishApi(self.environment.api)

      const result = await api.getByChef(chefId)

      if (result.kind === "ok") {
        self.setDishesChef(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log(`Error : ${result}`)
      }
    },
  }))
