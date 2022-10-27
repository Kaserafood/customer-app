import { types } from "mobx-state-tree"

export const CouponModalStoreModel = types
  .model("CommonStore")
  .props({
    isVisible: types.optional(types.boolean, false),
    title: types.optional(types.string, ""),
    subtitle: types.optional(types.string, ""),
    image: types.optional(types.string, ""),
  })
  .actions((self) => ({
    setVisible(isVisible: boolean) {
      self.isVisible = isVisible
    },
    setTitle(title: string) {
      self.title = title
    },
    setSubtitle(subtitle: string) {
      self.subtitle = subtitle
    },
    setImage(image: string) {
      self.image = image
    },
    resetValue() {
      self.isVisible = false
      self.title = ""
      self.subtitle = ""
      self.image = ""
    },
  }))
