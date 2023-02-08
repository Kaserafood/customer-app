import { cast, detach, SnapshotIn, types, applySnapshot } from "mobx-state-tree"

import { metaData } from "./order/order"
import { dishChef } from "./dish-store"

const metaDataCart = metaData.props({
  total: types.number,
})

const itemCartStore = types.model("ItemCartStore").props({
  dish: types.maybeNull(dishChef),
  quantity: types.maybeNull(types.number),
  noteChef: types.maybeNull(types.string),
  total: types.maybeNull(types.number),
  metaData: types.array(metaDataCart),
  tempId: types.maybeNull(types.string),
  addons: types.maybeNull(types.string),
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
      const { dish, quantity, noteChef, addons, tempId } = itemCart
      console.log("item", itemCart)
      self.cart.push({
        tempId,
        dish: JSON.parse(JSON.stringify(dish)),
        quantity,
        noteChef: noteChef,
        total: itemCart.total,
        metaData: cast(itemCart.metaData),
        addons,
      })
    },
    updateItem(itemCart: ItemCart) {
      const { tempId, quantity, noteChef, addons, total } = itemCart
      const item = self.cart.find((item) => item.tempId === tempId)
      console.log("itemUpdate", tempId)
      if (item) {
        item.quantity = quantity
        item.noteChef = noteChef
        item.total = total
        item.metaData = cast(itemCart.metaData)
        item.addons = addons

        applySnapshot(self.cart[self.cart.indexOf(item)], item)
      }
    },
    removeItem(index: number) {
      detach(self.cart[index])
    },
    cleanItems() {
      detach(self.cart)
    },
    setSubmited(isSubmited: boolean) {
      self.isSubmited = isSubmited
    },
    setDiscount(discount: number) {
      self.discount = discount
    },
  }))
