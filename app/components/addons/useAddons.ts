import { Addon } from "../../models/dish"
import { StateHandler } from "./stateHandler"

const MULTIPLE_CHOICE = "multiple_choice"

export const useAddon = (stateHandler: StateHandler) => {
  const initState = (addons: Addon[]) => {
    const newState = {}
    addons.forEach((addon) => {
      let state: any = {
        value: addon.required ? 1 : 0,
        price: addon.price,
        total: addon.price,
        label: addon.label_option,
      }
      if (addon.type === MULTIPLE_CHOICE) {
        state = {
          ...state,
          checked: false,
          options: addon.options.map((option) => {
            return { ...option, checked: false, disabled: false }
          }),
        }
        if (addon.required === 1) state.checked = true
      }
      newState[addon.name] = state
    })
    stateHandler.setState(newState)
  }

  const changeValueIncrement = (name: string, value: number, isIncrement: boolean) => {
    const newState = stateHandler.getState()
    newState[name].value = isIncrement ? value + 1 : value - 1

    if (newState[name].value >= 1) {
      newState[name].checked = true
      newState[name].total = newState[name].value * newState[name].price
    } else {
      newState[name].checked = false
      newState[name].total = newState[name].price
    }

    stateHandler.setState(newState)
  }

  const changeValueChecked = (name: string, isChecked: boolean) => {
    const newState = stateHandler.getState()
    newState[name].checked = isChecked
    if (isChecked) newState[name].total = newState[name].options[0].price
    else newState[name].total = 0
    stateHandler.setState(newState)
  }

  const changeValueCheckedOption = (name: string, optionSelected: any, isChecked: boolean) => {
    const newState = stateHandler.getState()
    newState[name].options.forEach((option) => {
      if (option.label === optionSelected.label) option.checked = isChecked
    })

    const countChecked = newState[name].options.filter((option) => option.checked).length
    if (countChecked > 0) newState[name].checked = true

    stateHandler.setState(newState)
  }

  const uncheckAllOptions = (name: string) => {
    const newState = stateHandler.getState()
    newState[name].options.forEach((option) => {
      option.checked = false
    })

    stateHandler.setState(newState)
  }

  const onDisableOptions = (name: string, options: any, isDisabled: boolean) => {
    const newState = stateHandler.getState()
    newState[name].options.forEach((option) => {
      const includes = options.find((opt) => opt.label === option.label)
      if (includes) {
        option.disabled = isDisabled
      }
    })

    stateHandler.setState(newState)
  }

  return {
    initState,
    changeValueIncrement,
    changeValueChecked,
    changeValueCheckedOption,
    uncheckAllOptions,
    onDisableOptions,
  }
}
