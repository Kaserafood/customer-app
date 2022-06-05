import { SnapshotOut, types } from "mobx-state-tree"
import { DishChef, dishChef } from "./dish-store"

const itemCartStore = types.model("ItemCartStore").props({
  dish: types.maybe(dishChef),
  quantity: types.maybe(types.number),
  noteChef: types.maybe(types.string),
  total: types.maybe(types.number),
})
export interface ItemCart extends SnapshotOut<typeof itemCartStore> {}

export const CartStoreModel = types
  .model("CartStoreModel")
  .props({
    cart: types.optional(types.array(itemCartStore), []),
  })
  .views((self) => ({
    get subtotal() {
      return self.cart.reduce((acc, item) => acc + (item.total ?? 0), 0)
    },
    get hasItems() {
      return self.cart.length > 0
    },
  }))
  .actions((self) => ({
    addItem(dish: DishChef, quantity: number, noteChef: string) {
      const exists = self.cart.find((item) => item.dish?.id === dish.id)
      if (exists) {
        exists.quantity += quantity
        exists.noteChef = noteChef
        exists.total += dish.price * quantity

        self.cart[self.cart.indexOf(exists)] = exists
      } else {
        self.cart.push({
          dish: JSON.parse(JSON.stringify(dish)),
          quantity,
          noteChef: noteChef,
          total: dish.price * quantity,
        })
      }
    },
    removeItem(index: number) {
      self.cart.splice(index, 1)
    },
  }))
