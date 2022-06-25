import { cast, SnapshotIn, types } from "mobx-state-tree"
import { dishChef } from "./dish-store"
import { metaData } from "./order/order"

const Number = types.custom<string, number>({
  name: "Number",
  fromSnapshot(value: string) {
    return Number(value)
  },
  toSnapshot(value: number) {
    return value.toString()
  },
  isTargetType(value: any): boolean {
    return typeof value === "number"
  },
  getValidationMessage(value: string): string {
    if (/^-?\d+\.\d+$/.test(value)) return "" // OK
    return `'${value}' doesn't look like a valid decimal number`
  },
})

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
})
export interface ItemCart extends SnapshotIn<typeof itemCartStore> {}
export interface MetaDataCart extends SnapshotIn<typeof metaDataCart> {}

export const CartStoreModel = types
  .model("CartStoreModel")
  .props({
    cart: types.array(itemCartStore),
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
      let currentItem = self.cart.find((item) => item.dish?.id === dish.id)

      if (currentItem) {
        currentItem = {
          ...currentItem,
          quantity: currentItem.quantity + quantity,
          noteChef: noteChef,
          total: itemCart.total + (currentItem.total ?? 0),
          metaData: cast(itemCart.metaData),
        }

        self.cart[self.cart.indexOf(currentItem)] = JSON.parse(JSON.stringify(currentItem))
      } else {
        self.cart.push({
          dish: JSON.parse(JSON.stringify(dish)),
          quantity,
          noteChef: noteChef,
          total: itemCart.total,
          metaData: cast(itemCart.metaData),
        })
      }
    },
    removeItem(index: number) {
      self.cart.splice(index, 1)
    },
  }))
