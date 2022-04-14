import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { ModalStoreModel } from "../modal-store/modal-store"
import { UserRegisterModel, IUserRegister } from "../user-store/user-store"
import { DayStoreModel } from "../delivery-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  modalStore: types.optional(ModalStoreModel, {} as any),
  userStore: types.optional(UserRegisterModel, {} as any),
  dayStore: types.optional(DayStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
