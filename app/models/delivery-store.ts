import { flow, types } from "mobx-state-tree"

import { Api, CommonResponse } from "../services/api"

export const DeliveryStoreModel = types
  .model("DeliveryStore")
  .props({
    priceDelivery: types.optional(types.number, 0),
    coverage: types.maybeNull(types.string),
  })
  .actions((self) => ({
    getPriceDelivery: flow(function* getPriceDelivery(addressId = -1) {
      const api = new Api()

      const result: CommonResponse = yield api.getPriceDelivery(addressId)
      if (result && result.kind === "ok") {
        self.priceDelivery = Number(result.data?.data)
      }
    }),
  }))
