import { SnapshotIn, applySnapshot, cast, detach, types } from "mobx-state-tree"

import { dishChef } from "./dish-store"
import { metaData } from "./order/order"

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

const itemCartPlans = types.model("ItemCartPlans").props({
  id: types.number,
  name: types.maybeNull(types.string),
  quantity: types.number,
  credits: types.number,
  date: types.string,
  dateLongName: types.maybeNull(types.string),
  dateShortName: types.maybeNull(types.string),
})
interface ItemPlan extends SnapshotIn<typeof itemCartPlans> {}

export const CartStoreModel = types
  .model("CartStoreModel")
  .props({
    cart: types.array(itemCartStore),
    isSubmited: types.maybe(types.boolean),
    discount: types.maybe(types.number),
    cartPlans: types.array(itemCartPlans),
    hasCredits: types.maybe(types.boolean),
  })
  .views((self) => ({
    get subtotal() {
      return self.cart.reduce((acc, item) => acc + (item.total ?? 0), 0)
    },
    get hasItems() {
      return self.cart.length > 0
    },
    get hasItemsPlan() {
      return self.cartPlans.length > 0
    },
    get useCredits() {
      return self.cartPlans.reduce((acc, item) => acc + (item.credits ?? 0), 0)
    },
    exitsItemPlan(id: number, date: string) {
      return self.cartPlans.find((item) => item.id === id && item.date === date)
    },
    get countQuantityItemsPlan() {
      return self.cartPlans.reduce((acc, item) => acc + (item.quantity ?? 0), 0)
    },
    get datesDelivery() {
      const dates = []

      self.cartPlans.forEach((item) => {
        dates.push(item.dateShortName)
      })

      const uniqueDates = dates.filter(
        (item, index, self) => index === self.findIndex((t) => t === item),
      )

      return uniqueDates.join(", ")
    },
  }))
  .actions((self) => ({
    addItem(itemCart: ItemCart) {
      const { dish, quantity, noteChef, addons, tempId } = itemCart
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
    addItemPlan(itemCart: ItemPlan) {
      self.cartPlans.push(itemCart)
    },
    removeItemPlan(id: number, date: string) {
      const item = self.cartPlans.find((item) => item.id === id && item.date === date)

      detach(self.cartPlans[self.cartPlans.indexOf(item)])
    },
    cleanItemsPlan() {
      detach(self.cartPlans)
    },
    updateItemPlan(itemCart: ItemPlan) {
      const { id, date } = itemCart
      const item = self.cartPlans.find((item) => item.id === id && item.date === date)
      applySnapshot(self.cartPlans[self.cartPlans.indexOf(item)], itemCart)
    },
    itemPlanCredits(id: number, date: string) {
      const item = self.cartPlans.find((item) => item.id === id && item.date === date)
      return item?.credits ?? 0
    },
    itemPlanQuantity(id: number, date: string) {
      const item = self.cartPlans.find((item) => item.id === id && item.date === date)
      return item?.quantity ?? 0
    },
    setHasCredits(hasCredits: boolean) {
      self.hasCredits = hasCredits
    },
  }))
