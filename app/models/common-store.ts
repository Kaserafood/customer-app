import { types } from "mobx-state-tree"

export const CommonStoreModel = types
  .model("CommonStore")
  .props({
    isVisibleLoading: types.optional(types.boolean, false),
    currentChefId: types.optional(types.number, 0),
    isSignedIn: types.optional(types.boolean, false),
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
  }))
