import { makeAutoObservable } from "mobx"

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
