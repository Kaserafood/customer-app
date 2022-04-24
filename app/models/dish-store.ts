import { Instance, types } from "mobx-state-tree"
import { DishApi } from "../services/api/dish-api"
import { handleDataResponseAPI } from "../utils/messages"
import { addons, dish } from "./dish"
import { withEnvironment } from "./extensions/with-environment"
import { userChef, UserChef } from "./user-store/user-store"

export const dishStore = dish.props({
  chef: types.optional(types.maybe(userChef), {}),
})

export interface Dish extends Instance<typeof dishStore> {}

export const DishStoreModel = types
  .model("DishStoreModel")
  .props({
    dishes: types.optional(types.array(dishStore), []), // All dishes
    dishesCategory: types.optional(types.array(dishStore), []), // Dishes filtered by category
    dishesChef: types.optional(types.array(dishStore), []),
    dishesGroupedByChef: types.optional(types.array(userChef), []), // Dishes grouped by chef
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
    setDishesGroupedByChef: async (userChefs: UserChef[]) => {
      self.dishesGroupedByChef.replace(userChefs)
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
    getGroupedByChef: async (date: string, timeZone: string) => {
      const api = new DishApi(self.environment.api)

      const result = await api.getGroupedByChef(date, timeZone)

      if (result.kind === "ok") {
        self.setDishesGroupedByChef(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log(`Error : ${result}`)
      }
    },
  }))
