import { cast, SnapshotIn, types } from "mobx-state-tree"

import { generateUUID } from "../utils/security"

import { metaData } from "./order/order"
import { dishChef } from "./dish-store"

const metaDataCart = metaData.props({
  label: types.string,
  total: types.number,
})

const itemCartStore = types.model("ItemCartStore").props({
  dish: types.maybe(dishChef),
  quantity: types.maybe(types.number),
  noteChef: types.maybe(types.string),
  total: types.maybe(types.number),
  metaData: types.array(metaDataCart),
  tempId: types.maybe(types.string),
})
export interface ItemCart extends SnapshotIn<typeof itemCartStore> {}
export interface MetaDataCart extends SnapshotIn<typeof metaDataCart> {}

export const CartStoreModel = types
  .model("CartStoreModel")
  .props({
    cart: types.array(itemCartStore),
    isSubmited: types.maybe(types.boolean),
    discount: types.maybe(types.number),
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
    addItem(itemCart: ItemCart) {
      const { dish, quantity, noteChef } = itemCart

      self.cart.push({
        tempId: generateUUID(),
        dish: JSON.parse(JSON.stringify(dish)),
        quantity,
        noteChef: noteChef,
        total: itemCart.total,
        metaData: cast(itemCart.metaData),
      })
    },
    removeItem(index: number) {
      self.cart.splice(index, 1)
    },
    cleanItems() {
      self.cart.clear()
    },
    setSubmited(isSubmited: boolean) {
      self.isSubmited = isSubmited
    },
    setDiscount(discount: number) {
      self.discount = discount
    },
  }))
