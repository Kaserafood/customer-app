import { types } from "mobx-state-tree"

export const CommonStoreModel = types
  .model("CommonStore")
  .props({
    isVisibleModal: types.optional(types.boolean, false),
    isVisibleModalLocaton: types.optional(types.boolean, false),
    isVisibleModalDayDelivery: types.optional(types.boolean, false),
    isVisibleLoading: types.optional(types.boolean, false),

    currentChefId: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setVisibleModal(isModalVisible: boolean) {
      self.isVisibleModal = isModalVisible
    },
    setVisibleModalLocaton(isModalVisible: boolean) {
      self.isVisibleModalLocaton = isModalVisible
      self.isVisibleModal = isModalVisible
    },
    setVisibleModalDayDelivery(isModalVisible: boolean) {
      self.isVisibleModalDayDelivery = isModalVisible
      self.isVisibleModal = isModalVisible
    },
    setVisibleLoading(isLoading: boolean) {
      self.isVisibleLoading = isLoading
    },
    setCurrentChefId(chefId: number) {
      self.currentChefId = chefId
    },
  }))
