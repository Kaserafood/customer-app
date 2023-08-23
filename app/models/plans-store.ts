import { types } from "mobx-state-tree"

export const PlansStoreModel = types
  .model("PlansStoreModel")
  .props({
    totalCredits: types.optional(types.number, 0),
    expireDate: types.optional(types.string, ""),
    type: types.optional(types.string, ""),
    price: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setTotalCredits(totalCredits: number) {
      self.totalCredits = totalCredits
    },
    setExpireDate(expireDate: string) {
      self.expireDate = expireDate
    },
    setType(type: string) {
      self.type = type
    },
    setPrice(price: number) {
      self.price = price
    },
  }))
