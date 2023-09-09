import { types } from "mobx-state-tree"

export const PlansStoreModel = types
  .model("PlansStoreModel")
  .props({
    id: types.optional(types.number, 0),
    totalCredits: types.optional(types.number, 0),
    expireDate: types.optional(types.string, ""),
    type: types.optional(types.string, ""),
    price: types.optional(types.number, 0),
    consumedCredits: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setId(id: number) {
      self.id = id
    },
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
    setPlan(plan: any) {
      if (plan) {
        self.id = plan.id
        self.totalCredits = plan.totalCredits
        self.expireDate = plan.expirationDate
        self.type = plan.type
        self.price = plan.price
        self.consumedCredits = plan.creditsConsumed
      } else {
        self.id = 0
        self.totalCredits = 0
        self.expireDate = ""
        self.type = ""
        self.price = 0
        self.consumedCredits = 0
      }
    },
    setConsumedCredits(consumedCredits: number) {
      self.consumedCredits = consumedCredits
    },
  }))
