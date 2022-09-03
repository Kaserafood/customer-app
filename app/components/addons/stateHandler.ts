import { makeAutoObservable } from "mobx"
import { MetaDataCart } from "../../models/cart-store"

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

  getMetaData(): MetaDataCart[] {
    const keys = Object.keys(this.state)

    const metaData = []
    keys.forEach((key) => {
      const addon = this.state[key]
      __DEV__ && console.log("Addon product: ", JSON.stringify(addon))
      if (addon.checked && addon.total > 0) {
        const meta: MetaDataCart = {
          key: `${key} (${addon.total})`,
          value: `${addon.value}`,
          label: addon.label,
          total: Number(addon.total),
        }

        if (addon.options && addon.options.filter((option) => option.checked).length > 0) {
          meta.label = addon.options
            .filter((option) => option.checked)
            .map((option) => option.label)
            .join(", ")
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
