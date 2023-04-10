import { applySnapshot, detach, flow, Instance, types } from "mobx-state-tree"

import { Api, DishResponse } from "../services/api"

import { Dish, dish } from "./dish"
import { userChef } from "./user-store"
import { DishParams } from "../screens/home/dish.types"

export const dishChef = dish.props({
  chef: types.optional(types.maybe(userChef), {}),
})

export interface DishChef extends Instance<typeof dishChef> {}

export const DishStoreModel = types
  .model("DishStoreModel")
  .props({
    dishes: types.optional(types.array(dishChef), []), // All dishes
    dishesCategory: types.optional(types.array(dishChef), []), // Dishes filtered by category
    dishesChef: types.optional(types.array(dishChef), []), // Dishes filtered by chef
    dishesGroupedByChef: types.optional(types.array(userChef), []), // Dishes grouped by chef
    dishesGroupedByLatestChef: types.optional(types.array(userChef), []), // Dishes grouped by latest chef
    dishesFavorites: types.optional(types.array(dishChef), []), // Dishes favorites by Kasera
    dishesSearch: types.optional(types.array(dishChef), []), // Dishes search
    isUpdate: types.optional(types.boolean, false),
    currentTokenPagination: types.maybeNull(types.string),
  })
  .views((self) => ({
    get totalDishes() {
      return self.dishes.length
    },
    get totalDishesFavorites() {
      return self.dishesFavorites.length
    },
  }))
  .actions((self) => ({
    getAll: flow(function* (params: DishParams) {
      const {
        categoryId,
        cleanCurrentDishes,
        date,
        timeZone,
        userId,
        tokenPagination,
        latitude,
        longitude,
      } = params
      if (categoryId) detach(self.dishesCategory)
      else {
        if (cleanCurrentDishes) detach(self.dishes)
      }
      const api = new Api()
      const result = yield api.getAllDishes(
        date,
        timeZone,
        userId,
        tokenPagination,
        latitude,
        longitude,
        categoryId,
      )

      if (result && result.kind === "ok") {
        if (categoryId) applySnapshot(self.dishesCategory, result.data)
        else {
          self.currentTokenPagination = result.data?.tokenPagination
          if (tokenPagination) {
            if (!result.data?.dishes || result.data?.dishes.length === 0)
              return { isEmptyResult: true }
            applySnapshot(self.dishes, self.dishes.concat(result.data?.dishes))
          } else {
            if (result.data?.dishes) applySnapshot(self.dishes, result.data?.dishes)
          }
        }
      }
    }),
    getByChef: flow(function* getByChef(chefId: number) {
      detach(self.dishesChef)
      const api = new Api()
      const result = yield api.getDishesByChef(chefId)
      if (result && result.kind === "ok") {
        applySnapshot(self.dishesChef, result.data)
      }
    }),

    getGroupedByChef: flow(function* getGroupedByChef(date: string, timeZone: string) {
      detach(self.dishesGroupedByChef)
      const api = new Api()
      const result = yield api.getDishesGroupedByChef(date, timeZone)
      if (result.kind === "ok") {
        applySnapshot(self.dishesGroupedByChef, result.data)
      }
    }),
    getGroupedByLatestChef: flow(function* getGroupedByLatestChef(date: string, timeZone: string) {
      detach(self.dishesGroupedByChef)
      const api = new Api()
      const result = yield api.getDishesGroupedByLatestChef(date, timeZone)

      if (result.kind === "ok") {
        applySnapshot(self.dishesGroupedByLatestChef, result.data)
      }
    }),

    clearDishes() {
      self.dishes.clear()
    },
    clearDishesChef() {
      self.dishesChef.clear()
    },

    request: flow(function* request(
      nameDish: string,
      peopleDish: number,
      date: string,
      userEmail: string,
      userId: number,
    ) {
      const api = new Api()
      const result = yield api.requestDish(nameDish, peopleDish, date, userEmail, userId)
      if (result.kind === "ok") {
        return result.data
      }
      return {}
    }),
    getFavorites: flow(function* getFavorites(date: string, timeZone: string) {
      const api = new Api()
      const result = yield api.getFavoritesDishes(date, timeZone)

      if (result && result.kind === "ok") {
        self.dishesFavorites.replace(result.data)
      }
    }),
    getDish: flow(function* getDish(dishId: number): Generator<any, DishChef, DishResponse> {
      const api = new Api()
      const result = yield api.getDish(dishId)

      if (result && result.kind === "ok") {
        return result.data as DishChef
      }
      return null
    }),
    getSearch: flow(function* getSearch(search: string, date: string, timeZone: string) {
      const api = new Api()
      const result = yield api.getSearchDishes(search, date, timeZone)

      if (result && result.kind === "ok") {
        self.dishesSearch.replace(result.data)
      } else {
        self.dishesSearch.clear()
      }
    }),
    clearSearchDishes() {
      self.dishesSearch.clear()
    },
    setIsUpdate(value: boolean) {
      self.isUpdate = value
    },
  }))
