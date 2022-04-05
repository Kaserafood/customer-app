import { types } from "mobx-state-tree"

export const ModalStoreModel = types
  .model("ModalStore")
  .props({
    isVisibleModal: types.optional(types.boolean, false),
    isVisibleModalLocaton: types.optional(types.boolean, false),
    isVisibleModalDayDelivery: types.optional(types.boolean, false),
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
  }))
