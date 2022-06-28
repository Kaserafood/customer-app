import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Api, CommonResponse, OrderOverviewResponse } from "../../services/api"

export const metaData = types.model("metaData").props({
  key: types.maybe(types.string),
  value: types.maybe(types.string),
})
const product = types.model("Product").props({
  productId: types.maybe(types.number),
  quantity: types.maybe(types.number),
  name: types.maybe(types.string),
  price: types.maybe(types.number),
  metaData: types.array(metaData),
})

const card = types.model("Card").props({
  cardNumber: types.maybe(types.string),
  dateExpiry: types.maybe(types.string),
  cvv: types.maybe(types.string),
  name: types.maybe(types.string),
  type: types.maybe(types.string),
})

const orderModel = types.model("Order").props({
  id: types.maybe(types.number),
  customerId: types.maybe(types.number),
  address: types.maybe(types.string),
  country: types.maybe(types.string),
  city: types.union(types.maybe(types.string), types.null),
  region: types.union(types.maybe(types.string), types.null),
  products: types.optional(types.array(product), []),
  priceDelivery: types.maybe(types.number),
  metaData: types.optional(types.array(metaData), []),
  customerNote: types.maybe(types.string),
  currencyCode: types.union(types.maybe(types.string), types.null),
  taxId: types.union(types.maybe(types.string), types.null),
  uuid: types.union(types.maybe(types.string), types.null),
  card: types.union(types.maybe(card), types.null),
})

const orderOverviewModel = types.model("OrderOverview").props({
  id: types.maybe(types.number),
  chefName: types.maybe(types.string),
  status: types.maybe(types.string),
  woocommerceStatus: types.maybe(types.string),
  deliveryDate: types.maybe(types.string),
  deliverySlotTime: types.maybe(types.string),
  productCount: types.maybe(types.number),
  total: types.maybe(types.number),
  chefImage: types.maybe(types.string),
})

export interface Order extends SnapshotOut<typeof orderModel> {}
export interface OrderOverview extends SnapshotOut<typeof orderOverviewModel> {}
export interface MetaData extends Instance<typeof metaData> {}
export interface Products extends Instance<typeof product> {}

/**
 * Model for orders.
 */
export const OrderModel = types
  .model("Order")
  .props({
    ordersOverview: types.optional(types.array(orderOverviewModel), []),
  })
  .views((self) => ({
    // Retorna la ordenes que estan en estado "En espera" o "Procesnado"
    get ordersOverviewInProgress() {
      return self.ordersOverview.filter(
        (order) =>
          order.woocommerceStatus === "wc-on-hold" || order.woocommerceStatus === "wc-processing",
      )
    },
    // Retorna la ordenes que estan en estado "Facturado" o "Completado"
    get ordersOverviewCompleted() {
      return self.ordersOverview.filter(
        (order) =>
          order.woocommerceStatus === "wc-billing" || order.woocommerceStatus === "wc-completed",
      )
    },
  }))
  .actions((self) => ({
    add: flow(function* add(order: Order) {
      const api = new Api()
      const result: CommonResponse = yield api.addOrder(order)

      if (result && result.kind === "ok") {
        return result.data
      }
      return null
    }),
    getAll: flow(function* getAll(userId: number) {
      self.ordersOverview.clear()
      const api = new Api()
      const result: OrderOverviewResponse = yield api.getOrdersOverview(userId)
      if (result && result.kind === "ok") {
        self.ordersOverview.replace(result.data)
      } else self.ordersOverview.replace([])
    }),
  }))
