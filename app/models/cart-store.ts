import { types, SnapshotOut } from "mobx-state-tree"
import { Dish, dishStore } from "./dish-store"

const itemCartStore = types.model("ItemCartStore").props({
  dish: types.maybe(dishStore),
  quantity: types.maybe(types.number),
  commentChef: types.maybe(types.string),
  total: types.maybe(types.number),
})
export interface ItemCart extends SnapshotOut<typeof itemCartStore> {}

export const CartStoreModel = types
  .model("CartStoreModel")
  .props({
    cart: types.optional(types.array(itemCartStore), []),
  })
  .actions((self) => ({
    addItem(dish: Dish, quantity: number, commentChef: string) {
      self.cart.push({
        dish: JSON.parse(JSON.stringify(dish)),
        quantity,
        commentChef,
        total: dish.price * quantity,
      })
    },
    removeItem(index: number) {
      self.cart.splice(index, 1)
    },
  }))
