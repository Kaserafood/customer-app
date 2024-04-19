import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"

import {
  Api,
  CommonResponse,
  CuponResponse,
  OrderDetailResponse,
  OrderOverviewResponse,
} from "../../services/api"

export const metaData = types.model("metaData").props({
  key: types.maybeNull(types.string),
  value: types.maybeNull(types.string),
})
const product = types.model("Product").props({
  productId: types.maybeNull(types.number),
  quantity: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  price: types.maybeNull(types.number),
  metaData: types.array(metaData),
})

const orderModel = types.model("Order").props({
  id: types.maybeNull(types.number),
  customerId: types.maybeNull(types.number),
  address: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
  city: types.union(types.maybeNull(types.string), types.null),
  region: types.union(types.maybeNull(types.string), types.null),
  products: types.optional(types.array(product), []),
  priceDelivery: types.maybeNull(types.number),
  metaData: types.optional(types.array(metaData), []),
  customerNote: types.maybeNull(types.string),
  currencyCode: types.union(types.maybeNull(types.string), types.null),
  taxId: types.union(types.maybeNull(types.string), types.null),
  uuid: types.union(types.maybeNull(types.string), types.null),
  paymentMethodId: types.union(types.maybeNull(types.number), types.null, types.string),
  paymentMethod: types.maybeNull(types.string),
  couponCode: types.union(types.maybeNull(types.string), types.null),
  couponType: types.maybeNull(types.string),
  total: types.maybeNull(types.number),
  discount: types.maybeNull(types.number),
})

const orderOverviewModel = types.model("OrderOverview").props({
  id: types.maybeNull(types.number),
  chefName: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  woocommerceStatus: types.maybeNull(types.string),
  deliveryDate: types.maybeNull(types.string),
  deliverySlotTime: types.maybeNull(types.string),
  productCount: types.maybeNull(types.number),
  total: types.maybeNull(types.number),
  chefImage: types.maybeNull(types.string),
  currencyCode: types.maybeNull(types.string),
})

const orderDetail = orderOverviewModel.props({
  products: types.optional(types.maybeNull(types.array(product)), []),
  deliveryAddress: types.maybeNull(types.string),
  paymentMethod: types.maybeNull(types.string),
  deliveryPrice: types.maybeNull(types.number),
  paymentPending: types.maybeNull(types.number),
  discount: types.maybeNull(types.number),
})

const couponModel = types.model("Coupon").props({
  id: types.maybeNull(types.number),
  code: types.maybeNull(types.string),
  discountAmount: types.maybeNull(types.number),
  type: types.maybeNull(types.string),
  limitPerUser: types.maybeNull(types.number),
})

export interface Order extends SnapshotOut<typeof orderModel> {}
export interface OrderOverview extends SnapshotOut<typeof orderOverviewModel> {}
export interface MetaData extends Instance<typeof metaData> {}
export interface Products extends Instance<typeof product> {}
export interface OrderDetail extends Instance<typeof orderDetail> {}

export interface Coupon extends SnapshotOut<typeof couponModel> {}
/**
 * Model for orders.
 */
export const OrderModel = types
  .model("Order")
  .props({
    ordersOverview: types.optional(types.array(orderOverviewModel), []),
    orderDetail: types.optional(orderDetail, {}),
    priceDelivery: types.optional(types.number, 0),
  })
  .views((self) => ({
    // Retorna la ordenes que estan en estado "En espera" o "Procesnado"
    get ordersOverviewInProgress() {
      return self.ordersOverview.filter(
        (order) =>
          order.woocommerceStatus === "wc-pending-confirmation" ||
          order.woocommerceStatus === "wc-confirmed" ||
          order.woocommerceStatus === "wc-on-route",
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
    getDetail: flow(function* getDetail(orderId: number) {
      const api = new Api()
      const result: OrderDetailResponse = yield api.getOrderDetail(orderId)
      if (result && result.kind === "ok") {
        self.orderDetail = result.data
      }
    }),
    getCoupon: flow(function* getCoupon(couponCode: string, userId: number, timeZone: string) {
      const api = new Api()
      const result: CuponResponse = yield api.getCoupon(couponCode, userId, timeZone)
      if (result && result.kind === "ok") {
        return result.data
      }
      return null
    }),
  }))
