import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AddressModelStore } from "../address/address"
import { CartStoreModel } from "../cart-store"
import { CategoryStoreModel } from "../category-store"
import { CommonStoreModel } from "../common-store"
import { DayStoreModel } from "../day-store"
import { DishStoreModel } from "../dish-store"
import { OrderModel } from "../order/order"
import { UserRegisterModel } from "../user-store"
import { CoverageModel } from "../coverage/coverage"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  commonStore: types.optional(CommonStoreModel, {} as any),
  userStore: types.optional(UserRegisterModel, {} as any),
  dayStore: types.optional(DayStoreModel, {} as any),
  categoryStore: types.optional(CategoryStoreModel, {} as any),
  dishStore: types.optional(DishStoreModel, {} as any),
  cartStore: types.optional(CartStoreModel, {} as any),
  addressStore: types.optional(AddressModelStore, {} as any),
  orderStore: types.optional(OrderModel, {} as any),
  coverageStore: types.optional(CoverageModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
