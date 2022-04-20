import { types, Instance, SnapshotIn } from "mobx-state-tree"
import { withEnvironment } from "./extensions/with-environment"

import { handleDataResponseAPI } from "../utils/messages"
import { userChef } from "./user-store/user-store"
import { DishApi } from "../services/api/dish-api"

const dishStore = types.model("DishStore").props({
  id: types.maybe(types.number),
  title: types.maybe(types.string),
  description: types.maybe(types.string),
  price: types.maybe(types.number),
  image: types.maybe(types.string),
  addons: types.maybe(types.string),
  chef: types.maybe(userChef),
})

export interface Dish extends Instance<typeof dishStore> {}

export const DishStoreModel = types
  .model("DishStoreModel")
  .props({
    dishes: types.optional(types.array(dishStore), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setDays: async (dishes: Dish[]) => {
      self.dishes.replace(dishes)
    },
  }))
  .actions((self) => ({
    getAll: async (date: string, timeZone: string, categoryId?: number) => {
      const api = new DishApi(self.environment.api)

      const result = await api.getAll(date, timeZone, categoryId)

      if (result.kind === "ok") {
        self.setDays(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log("Error : " + result)
      }
    },
  }))
