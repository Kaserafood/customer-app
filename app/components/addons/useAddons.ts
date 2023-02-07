import { AddonItem } from "../../models/addons/addon"

const MULTIPLE_CHOICE = "multiple_choice"
const INPUT_MULTIPLER = "input_multiplier"
const CHECKBOX = "checkbox"
export const TRUE = "yes"
const FALSE = ""

export const useAddon = () => {
  const getAddonsWithTitle = (addons: AddonItem[]) => {
    return addons.filter(
      (addon) =>

      addon.show_title === TRUE && addon.incrementable === TRUE && addon.type === MULTIPLE_CHOICE
    )

      
  
  }

  const getAddonsWithoutTitle = (addons: Addon[]) => {
    return addons.filter((addon) => addon.show_title === FALSE && addon.incrementable === TRUE)

  }

  const getAddonsBoolean = (addons: AddonItem[]) => {
    return addons.filter(
      (addon) =>
        addon.showTitle === FALSE && addon.optionBoolean === TRUE && addon.type === MULTIPLE_CHOICE,
    )
  }
  const getAddonsMultileChoice = (addons: AddonItem[]) => {
    return addons.filter(
      (addon) =>
        addon.showTitle === TRUE &&
        addon.multipleChoice === TRUE &&
        (addon.type === MULTIPLE_CHOICE || addon.type === CHECKBOX),
    )
  }

  return {
    getAddonsWithTitle,
    getAddonsWithoutTitle,
    getAddonsBoolean,
    getAddonsMultileChoice,
  }
}
