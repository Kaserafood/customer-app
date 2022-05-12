import { Instance, types } from "mobx-state-tree"
import { Api } from "../services/api"
import { dish } from "./dish"
import { userChef, UserChef } from "./user-store"

export const dishChef = dish.props({
  chef: types.optional(types.maybe(userChef), {}),
})

export interface DishChef extends Instance<typeof dishChef> {}

export const DishStoreModel = types
  .model("DishStoreModel")
  .props({
    dishes: types.optional(types.array(dishChef), []), // All dishes
    dishesCategory: types.optional(types.array(dishChef), []), // Dishes filtered by category
    dishesChef: types.optional(types.array(dishChef), []),
    dishesGroupedByChef: types.optional(types.array(userChef), []), // Dishes grouped by chef
  })
  .actions((self) => ({
    setDishes: async (dishes: DishChef[]) => {
      self.dishes.replace(dishes)
    },
    setDishesCategory: async (dishes: DishChef[]) => {
      self.dishesCategory.replace(dishes)
    },
    setDishesChef: async (dishes: DishChef[]) => {
      self.dishesChef.replace(dishes)
    },
    setDishesGroupedByChef: async (userChefs: UserChef[]) => {
      self.dishesGroupedByChef.replace(userChefs)
    },
  }))
  .actions((self) => ({
    getAll: async (date: string, timeZone: string, categoryId?: number) => {
      const api = new Api()

      const result = await api.getAllDishes(date, timeZone, categoryId)

      if (result && result.kind === "ok") {
        if (categoryId) self.setDishesCategory(result.data)
        else self.setDishes(result.data)
      }
    },
    getByChef: async (chefId: number) => {
      const api = new Api()

      const result = await api.getDishesByChef(chefId)

      if (result && result.kind === "ok") {
        self.setDishesChef(result.data)
      }
    },
    getGroupedByChef: async (date: string, timeZone: string) => {
      const api = new Api()

      const result = await api.getDishesGroupedByChef(date, timeZone)

      if (result.kind === "ok") {
        self.setDishesGroupedByChef(result.data)
      }
    },
  }))
