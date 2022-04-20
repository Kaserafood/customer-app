import { Instance, types, SnapshotOut } from "mobx-state-tree"
import { withEnvironment } from "./extensions/with-environment"
import { CategoryApi } from "../services/api/category-api"
import { handleDataResponseAPI } from "../utils/messages"

const categoryStore = types.model("CategoryStore").props({
  categoryId: types.maybe(types.number),
  name: types.maybe(types.string),
  image: types.maybe(types.string),
})
export interface Category extends SnapshotOut<typeof categoryStore> {}

export const CategoryStoreModel = types
  .model("CategoryStoreModel")
  .props({
    categories: types.optional(types.array(categoryStore), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setDays: async (days: Category[]) => {
      self.categories.replace(days)
    },
  }))
  .actions((self) => ({
    getAll: async () => {
      if (self.categories.length > 0) return
      const api = new CategoryApi(self.environment.api)

      const result = await api.getAll()

      if (result.kind === "ok") {
        self.setDays(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log("Error : " + result)
      }
    },
  }))
