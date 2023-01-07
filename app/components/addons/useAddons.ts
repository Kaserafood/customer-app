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
        addon.showTitle === TRUE &&
        addon.incrementable === TRUE &&
        (addon.type === MULTIPLE_CHOICE || addon.type === INPUT_MULTIPLER),
    )
  }

  const getAddonsWithoutTitle = (addons: AddonItem[]) => {
    return addons.filter((addon) => addon.showTitle === FALSE && addon.type === INPUT_MULTIPLER)
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
