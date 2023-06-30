import { flow, types } from "mobx-state-tree"
import { Api } from "../services/api"

export const CommonStoreModel = types
  .model("CommonStore")
  .props({
    isVisibleLoading: types.optional(types.boolean, false),
    currentChefId: types.optional(types.number, 0),
    currentChefImage: types.optional(types.string, ""),
    isSignedIn: types.optional(types.boolean, false),
    phoneNumber: types.maybe(types.string),
  })
  .actions((self) => ({
    setVisibleLoading(isLoading: boolean) {
      self.isVisibleLoading = isLoading
    },
    setCurrentChefId(chefId: number) {
      self.currentChefId = chefId
    },
    setIsSignedIn(isSignedIn: boolean) {
      self.isSignedIn = isSignedIn
    },
    setCurrentChefImage(image: string) {
      self.currentChefImage = image
    },
    getPhoneSupport: flow(function* () {
      const api = new Api()
      const result = yield api.getParam("_phone_number")

      if (result && result.kind === "ok") {
        self.phoneNumber = result.data?.value
      }
    }),
  }))
