import { flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../services/api"
import { withEnvironment } from "./extensions/with-environment"

export const categoryStore = types.model("CategoryStore").props({
  id: types.maybe(types.number),
  name: types.maybe(types.string),
  image: types.maybe(types.string),
})
export interface Category extends SnapshotOut<typeof categoryStore> {}

export const CategoryStoreModel = types
  .model("CategoryStoreModel")
  .props({
    categories: types.optional(types.array(categoryStore), []),
    seasonal: types.optional(categoryStore, {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setCategories: async (categories: Category[]) => {
      self.categories.replace(categories)
    },
  }))
  .actions((self) => ({
    getAll: flow(function* getAll() {
      const api = new Api()
      const result = yield api.getAllCategories()

      if (result && result.kind === "ok") {
        self.setCategories(result.data)
      }
    }),
    getSeasonal: flow(function* getAll() {
      const api = new Api()
      const result = yield api.getCategorySeasonal()

      if (result && result.kind === "ok") {
        self.seasonal = result.data
      }
    }),
  }))
