import { SnapshotOut, flow, types } from "mobx-state-tree"

import { Api } from "../services/api"
import { withEnvironment } from "./extensions/with-environment"

export const bannerStore = types.model("CategoryStore").props({
  id: types.maybe(types.number),
  title: types.maybe(types.string),
  image: types.maybe(types.string),
  textWhite: types.maybe(types.boolean),
  buttonText : types.maybe(types.string),
  categoryId: types.maybe(types.number),
  categoryName : types.maybe(types.string),
  description : types.maybe(types.string),
  
})
export interface Banner extends SnapshotOut<typeof bannerStore> {}

export const BannerStoreModel = types
  .model("BannerStoreModel")
  .props({
    banners: types.optional(types.array(bannerStore), []),
    showWelcome: types.optional(types.boolean, false),
    showNewChefs: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setBanners:  (banners: Banner[]) => {
      self.banners.replace(banners)
    },
  }))
  .actions((self) => ({
    getAll: flow(function* getAll() {
      const api = new Api()
      const result = yield api.getBanners()

      if (result && result.kind === "ok") {
        self.setBanners(result.data)
      }
    }),

    getWelcome: flow(function* getWelcome() {
      const api = new Api()
      const result = yield api.getParam("welcome_banner")

      if (result && result.kind === "ok") {
        self.showWelcome = parseInt( result.data?.value ?? '0') === 1
      }
    }),
    getNewChefs: flow(function* getNewChefs() {
      const api = new Api()
      const result = yield api.getParam("new_chefs_banner")

      if (result && result.kind === "ok") {
        self.showNewChefs = parseInt( result.data?.value ?? '0') === 1
      }
    }),
  }))
