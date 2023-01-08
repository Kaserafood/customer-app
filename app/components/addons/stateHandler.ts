import { makeAutoObservable } from "mobx"

import { MetaDataCart } from "../../models/cart-store"
import { getLabelMetaCart } from "../../utils/string"

export class StateHandler {
  state = {}

  constructor() {
    makeAutoObservable(this)
  }

  setState(value: any) {
    this.state = value
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state))
  }

  setStateValue(name: string, value: any) {
    this.state[name] = value
  }

  getMetaData(currencyCode: string): MetaDataCart[] {
    const keys = Object.keys(this.state)
    __DEV__ && console.log("Addon state", this.state)

    const metaData = []
    keys.forEach((key) => {
      const addon = this.state[key]
      __DEV__ &&
        console.log(
          "Label meta: ",
          getLabelMetaCart(addon.value, addon.label, Number(addon.total ?? 0), currencyCode),
        )
      if (addon.checked) {
        const meta: MetaDataCart = {
          key: key,
          value: getLabelMetaCart(addon.value, addon.label, Number(addon.total ?? 0), currencyCode),
          total: Number(addon.total ?? 0),
        }

        if (addon.options && addon.options.filter((option) => option.checked).length > 0) {
          let label = addon.options
            .filter((option) => option.checked)
            .map((option) => option.label)
            .join(", ")

          meta.total = addon.options
            .filter((option) => option.checked)
            .reduce((total, option) => (total += Number(option.price ?? 0)), 0)

          meta.value = getLabelMetaCart(addon.value, label, meta.total, currencyCode)
        }

        metaData.push(meta)
      }
    })
    return metaData
  }

  get total() {
    const keys = Object.keys(this.state)
    let total = 0
    keys.forEach((key) => {
      const addon = this.state[key]

      if (addon.checked) {
        total += Number(addon.total)

        if (addon.options) {
          addon.options
            .filter((option) => option.checked)
            .forEach((option) => {
              total += Number(option.price)
            })
        }
      }
    })
    return total
  }
}
