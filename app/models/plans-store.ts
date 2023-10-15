import { types } from "mobx-state-tree"

const Config = types.model("Config").props({
  highPrice: types.number,
  mediumPrice: types.number,
  lowPrice: types.number,
  deliveryPrice: types.number,
})

export const PlansStoreModel = types
  .model("PlansStoreModel")
  .props({
    id: types.optional(types.number, 0),
    totalCredits: types.optional(types.number, 0),
    expireDate: types.optional(types.string, ""),
    type: types.optional(types.string, ""),
    price: types.optional(types.number, 0),
    consumedCredits: types.optional(types.number, 0),
    state: types.optional(types.string, ""),
    isCustom: types.optional(types.boolean, false),
    config: types.optional(Config, {
      highPrice: 0,
      mediumPrice: 0,
      lowPrice: 0,
      deliveryPrice: 0,
    }),
  })
  .views((self) => ({
    get hasActivePlan() {
      return self.id > 0 && self.state !== "expired"
    },
    get hasCredits() {
      return self.totalCredits - self.consumedCredits > 0
    },
    totalPayment: function (credits: number) {
      let priceCredits = 0
      if (credits > 0 && credits < 20) {
        return credits * self.config.highPrice
      } else if (credits >= 20 && credits < 40) {
        priceCredits = credits * self.config.mediumPrice
      } else priceCredits = credits * self.config.lowPrice

      return priceCredits
    },
  }))
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
        self.state = ""
      }
    },
    getPlan() {
      return {
        id: self.id,
        totalCredits: self.totalCredits,
        expireDate: self.expireDate,
        type: self.type,
        price: self.price,
        consumedCredits: self.consumedCredits,
        state: self.state,
      }
    },
    setConsumedCredits(consumedCredits: number) {
      self.consumedCredits = consumedCredits
    },
    setPlanConfig(config: any) {
      self.config = config
    },
    setIsCustom(isCustom: boolean) {
      self.isCustom = isCustom
    },
  }))
