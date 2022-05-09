import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CartStoreModel } from "../cart-store"
import { CategoryStoreModel } from "../category-store"
import { CharacterStoreModel } from "../character-store/character-store"
import { DayStoreModel } from "../day-store"
import { DishStoreModel } from "../dish-store"
import { CommonStoreModel } from "../common-store/common-store"
import { UserRegisterModel } from "../user-store/user-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  modalStore: types.optional(CommonStoreModel, {} as any),
  userStore: types.optional(UserRegisterModel, {} as any),
  dayStore: types.optional(DayStoreModel, {} as any),
  categoryStore: types.optional(CategoryStoreModel, {} as any),
  dishStore: types.optional(DishStoreModel, {} as any),
  cartStore: types.optional(CartStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
