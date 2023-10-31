import { types } from "mobx-state-tree"

const Config = types.model("Config").props({
  test: types.model({
    price: types.number,
    days: types.number,
    maxCredits: types.number,
  }),
  basic: types.model({
    price: types.number,
    days: types.number,
    maxCredits: types.number,
  }),
  happy: types.model({
    price: types.number,
    days: types.number,
    maxCredits: types.number,
  }),
  prime: types.model({
    price: types.number,
    days: types.number,
  }),
  minimumQuantityFreeDelivery: types.number,
  pricePerDay: types.number,
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
      test: {
        price: 0,
        days: 0,
        maxCredits: 0,
      },
      basic: {
        price: 0,
        days: 0,
        maxCredits: 0,
      },
      happy: {
        price: 0,
        days: 0,
        maxCredits: 0,
      },
      prime: {
        price: 0,
        days: 0,
      },
      minimumQuantityFreeDelivery: 0,
      pricePerDay: 0,
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
      if (credits > 0 && credits <= self.config.basic.maxCredits) {
        return credits * self.config.basic.price
      } else if (
        credits > self.config.basic.maxCredits &&
        credits <= self.config.happy.maxCredits
      ) {
        priceCredits = credits * self.config.happy.price
      } else priceCredits = credits * self.config.prime.price

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
