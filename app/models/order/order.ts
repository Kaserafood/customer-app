import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Api, CommonResponse } from "../../services/api"

const metaData = types.model("metaData").props({
  key: types.maybe(types.string),
  value: types.maybe(types.string),
})
const product = types.model("Product").props({
  productId: types.maybe(types.number),
  quantity: types.maybe(types.number),
})

const orderModel = types.model("Order").props({
  id: types.maybe(types.number),
  customerId: types.maybe(types.number),
  address: types.maybe(types.string),
  country: types.maybe(types.string),
  products: types.optional(types.array(product), []),
  priceDelivery: types.maybe(types.number),
  metaData: types.optional(types.array(metaData), []),
  customerNote: types.maybe(types.string),
})

export interface Order extends SnapshotOut<typeof orderModel> {}
export interface MetaData extends Instance<typeof metaData> {}
export interface Products extends Instance<typeof product> {}

/**
 * Model for orders.
 */
export const OrderModel = types
  .model("Order")
  .props({
    orders: types.optional(types.array(orderModel), []),
  })

  .actions(() => ({
    add: flow(function* add(order: Order) {
      const api = new Api()
      const result: CommonResponse = yield api.addOrder(order)

      if (result && result.kind === "ok") {
        return result.data
      }
      return null
    }),
  }))
