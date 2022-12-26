import { cast, flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

import {
  getAddonsMultileChoice,
  getTotal,
  isDependencyQuantity,
} from "../../components/addons/util"
import { getMinValue } from "../../utils/validate"
import { MetaDataCart } from "../cart-store"
import { addonItem, dependencies, option } from "../dish"

export const MULTIPLE_CHOICE = "multiple_choice"
export const INPUT_MULTIPLER = "input_multiplier"
export const CHECKBOX = "checkbox"
export const TRUE = "yes"
export const FALSE = ""

export interface Option extends SnapshotIn<typeof option> {}

export interface AddonItem extends SnapshotIn<typeof addonItem> {}
interface AddonItemModel extends Instance<typeof addonItem> {}

export const AddonModel = types
  .model("AddonModel")
  .props({
    addons: types.optional(types.array(addonItem), []),
  })
  .views((self) => ({
    findAddonByName(name: string) {
      return self.addons.find((addon) => addon.name === name)
    },
    getMetaData(): MetaDataCart[] {
      const metaData = []
      self.addons.forEach((addon) => {
        if ((addon.checked || addon.required === 1) && addon.total > 0) {
          const meta: MetaDataCart = {
            key: `${addon.name} (${addon.total})`,
            value: `${addon.value}`,
            label: addon.label,
            total: addon.total,
          }

          if (addon.options && addon.options.some((option) => option.checked)) {
            meta.label = addon.options
              .filter((option) => option.checked)
              .map((option) => option.label)
              .join(", ")
          }

          metaData.push(meta)
        }
      })
      return metaData
    },

    get total() {
      let total = 0
      self.addons.forEach((addon) => {
        if (addon.checked || addon.required === 1) {
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
    },

    get exitsAddons() {
      return self.addons.length > 0
    },
  }))
  .actions((self) => ({
    setAddons: (addons: AddonItemModel[]) => {
      self.addons.replace(addons)
    },
    updateAddon: (addon: AddonItemModel) => {
      const index = self.addons.findIndex((item) => item.name === addon.name)
      self.addons[index] = addon
    },
    getNumberOptionSelectables: (addon: AddonItem, addons: AddonItem[]) => {
      // Si la dependencia es de tipo "Cantidad"
      if (isDependencyQuantity(addon)) {
        const addonName: string = getAddonsMultileChoice(addons).find(
          (item) => item.hash === addon.dependencies.hash,
        ).name

        const addonItem = self.findAddonByName(addonName)

        return Number(addonItem.options.find((option) => option.checked)?.label) ?? 0
      }

      return Number(addon.numOptionSelectables)
    },
  }))
  .actions((self) => ({
    initState: (addons: AddonItemModel[]) => {
      const addonsState: AddonItemModel[] = []
      addons.forEach((addon) => {
        // The name property should be used as key in the state because does not exits ID
        let state = {
          ...addon,
          value: getMinValue(addon.required, addon.min),
          total: addon.price,
          label: addon.label,
          min: getMinValue(addon.required, addon.min),
          options: undefined,
          dependencies: undefined,
          checked: false,
        }
        if (addon.type === MULTIPLE_CHOICE || addon.type === CHECKBOX) {
          state = {
            ...state,
            checked: false,
            options: addon.options.map((option) => {
              return {
                ...option,
                checked: false,
                disabled: false,
              }
            }),
            dependencies: addon.dependencies,
          }
          if (addon.required === 1 && addon.optionBoolean !== TRUE && addon.multipleChoice !== TRUE)
            state.checked = true
        }
        addonsState.push(state)
      })
      self.setAddons(addonsState)
    },
    changeValueIncrement: (name: string, value: number, isIncrement: boolean) => {
      const addon = self.findAddonByName(name)
      addon.value = isIncrement ? value + 1 : value - 1

      if (addon.value >= 1) {
        addon.checked = true
        addon.total = getTotal(addon.min, addon.value, addon.price)
      } else {
        addon.checked = false
        addon.total = addon.price
      }

      console.log("addon", addon)

      self.updateAddon(addon)
    },
    calculateTotal(addon: AddonItemModel) {
      addon.total = getTotal(addon.min, addon.value, addon.price)
      self.updateAddon(addon)
    },
    changeValueChecked: (name: string, isChecked: boolean) => {
      const addon = self.findAddonByName(name)
      addon.checked = isChecked
      if (isChecked) addon.total = addon.options[0].price
      else addon.total = 0

      self.updateAddon(addon)
    },
    changeValueCheckedOption: (name: string, optionSelected: Option, isChecked: boolean) => {
      const addon = self.findAddonByName(name)
      addon.options.forEach((option) => {
        if (option.label === optionSelected.label) option.checked = isChecked
      })

      const countChecked = addon.options.filter((option) => option.checked).length
      if (countChecked > 0) addon.checked = true

      self.updateAddon(addon)
    },
    uncheckAllOptions: (name: string) => {
      const addon = self.findAddonByName(name)

      addon.options = cast(
        addon.options.map((option) => {
          option.checked = false
          return option
        }),
      )

      self.updateAddon(addon)
    },
    onDisableOptions: (name: string, options: Option[], isDisabled: boolean) => {
      const addon = self.findAddonByName(name)
      addon.options = cast(
        addon.options.map((option) => {
          const includes = options.find((opt) => opt.label === option.label)
          const opt = { ...option }
          if (includes) {
            opt.disabled = isDisabled
          }

          return opt
        }),
      )

      self.updateAddon(addon)
    },

    isValidAddonsMultiChoice: (addons: AddonItem[]) => {
      let isValid = true
      if (getAddonsMultileChoice(addons).length > 0) {
        getAddonsMultileChoice(addons).forEach((addon) => {
          const selectable = self.getNumberOptionSelectables(addon, addons)
          const selected = addon.options.filter((option) => option.checked).length

          if (selected < selectable) isValid = false
        })
      }

      return isValid
    },
  }))
