import { Addon } from "../../models/dish"
import { StateHandler } from "./stateHandler"

const MULTIPLE_CHOICE = "multiple_choice"
const INPUT_MULTIPLER = "input_multiplier"
const CHECKBOX = "checkbox"
const TRUE = "yes"
const FALSE = ""

export const useAddon = (stateHandler?: StateHandler) => {
  const initState = (addons: Addon[]) => {
    const newState = {}
    addons.forEach((addon) => {
      let state: any = {
        value: getMinValue(addon.required, addon.min),
        price: addon.price,
        total: addon.price,
        label: addon.label_option,
        min: getMinValue(addon.required, addon.min),
      }
      if (addon.type === MULTIPLE_CHOICE || addon.type === CHECKBOX) {
        state = {
          ...state,
          checked: false,
          options: addon.options.map((option) => {
            return { ...option, checked: false, disabled: false }
          }),
        }
        if (addon.required === 1 && addon.option_boolean !== TRUE && addon.multiple_choice !== TRUE)
          state.checked = true
      }
      newState[addon.name] = state
    })
    stateHandler.setState(newState)
  }

  const getMinValue = (required: number, min: number) => {
    if (required || min === 0) return min

    return min - 1
  }

  const changeValueIncrement = (name: string, value: number, isIncrement: boolean) => {
    const newState = stateHandler.getState()
    newState[name].value = isIncrement ? value + 1 : value - 1

    if (newState[name].value >= 1) {
      newState[name].checked = true
      newState[name].total = getTotal(newState[name])
    } else {
      newState[name].checked = false
      newState[name].total = newState[name].price
    }

    stateHandler.setState(newState)
  }

  const getTotal = (state: any): number => {
    /**
     * El total se calcula de la siguiente manera:
     * A la cantidad del complemento se le resta el resultado de restar la
     * cantidad minima menos uno, esto es porque, por ejemplo si se tiene una cantidad
     * minima de 3 y no se hace la resta correspondiente se estaria sumando el precio
     * de tres veces el producto cuando en realidad solo deber ser uno. EL uno se resta
     * porque ya se cuenta el precio del producto en si. Finalmente se multiplica por el precio
     */
    if (state.min >= 1) return (state.value - (state.min - 1)) * state.price

    return state.value * state.price
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

  const getAddonsWithTitle = (addons: Addon[]) => {
    return addons.filter(
      (addon) =>
        addon.show_title === TRUE && addon.incrementable === TRUE && addon.type === MULTIPLE_CHOICE,
    )
  }

  const getAddonsWithoutTitle = (addons: Addon[]) => {
    return addons.filter(
      (addon) =>
        addon.show_title === FALSE &&
        addon.incrementable === TRUE &&
        addon.type === INPUT_MULTIPLER,
    )
  }

  const getAddonsBoolean = (addons: Addon[]) => {
    return addons.filter(
      (addon) =>
        addon.show_title === FALSE &&
        addon.option_boolean === TRUE &&
        addon.type === MULTIPLE_CHOICE,
    )
  }
  const getAddonsMultileChoice = (addons: Addon[]) => {
    return addons.filter(
      (addon) =>
        addon.show_title === TRUE &&
        addon.multiple_choice === TRUE &&
        (addon.type === MULTIPLE_CHOICE || addon.type === CHECKBOX),
    )
  }

  return {
    initState,
    changeValueIncrement,
    changeValueChecked,
    changeValueCheckedOption,
    uncheckAllOptions,
    onDisableOptions,
    getAddonsWithTitle,
    getAddonsWithoutTitle,
    getAddonsBoolean,
    getAddonsMultileChoice,
  }
}
