import { AddonItem } from "../../models/addons/addon"

const MULTIPLE = "multiple"
const CHECKBOX = "checkbox"

const INCREMENTABLE = "incrementable"

export const useAddon = () => {
  const getIncrementableWithTitle = (addons: AddonItem[]) => {
    return addons.filter((addon) => addon.title && addon.type?.value === INCREMENTABLE)
  }

  const getAddonsWithoutTitle = (addons: AddonItem[]) => {
    return addons.filter((addon) => !addon.title && addon.type?.value === INCREMENTABLE)
  }

  const getAddonsBoolean = (addons: AddonItem[]) => {
    return addons.filter((addon) => addon.type.value === CHECKBOX)
  }

  const getMultipleChoice = (addons: AddonItem[]) => {
    return addons.filter((addon) => addon.title && addon.type?.value === MULTIPLE)
  }

  return {
    getIncrementableWithTitle,
    getAddonsWithoutTitle,
    getAddonsBoolean,
    getMultipleChoice,
  }
}
