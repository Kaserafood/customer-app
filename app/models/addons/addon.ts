import { applySnapshot, cast, detach, Instance, SnapshotIn, types } from "mobx-state-tree"

import { getLabelMetaCart } from "../../utils/string"
import { getMinValue } from "../../utils/validate"
import { MetaDataCart } from "../cart-store"
import { addonItem, option } from "../dish"

export const MULTIPLE_CHOICE = "multiple"
export const CHECKBOX = "checkbox"

export interface Option extends SnapshotIn<typeof option> {}

export interface AddonItem extends SnapshotIn<typeof addonItem> {}
export interface AddonItemModel extends Instance<typeof addonItem> {}

export const AddonModel = types
  .model("AddonModel")
  .props({
    addons: types.optional(types.array(addonItem), []),
  })
  .views((self) => ({
    findAddonById(id: string) {
      return self.addons.find((addon) => addon.id === id)
    },
    getMetaData(currencyCode: string): MetaDataCart[] {
      const metaData = []
      self.addons.forEach((addon) => {
        __DEV__ &&
          console.log(
            "Label meta: ",
            getLabelMetaCart(addon.value, addon.label, Number(addon.total ?? 0), currencyCode),
          )
        if (addon.checked) {
          const meta: MetaDataCart = {
            key: addon.title,
            value: getLabelMetaCart(
              addon.value,
              addon.label,
              Number(addon.total ?? 0),
              currencyCode,
            ),
            total: Number(addon.total ?? 0),
          }

          if (
            addon.multipleItems &&
            addon.multipleItems.filter((option) => option.checked).length > 0
          ) {
            const label = addon.multipleItems
              .filter((option) => option.checked)
              .map((option) => option.name)
              .join(", ")

            meta.total = addon.multipleItems
              .filter((option) => option.checked)
              .reduce((total, option) => (total += Number(option.price ?? 0)), 0)

            meta.value = getLabelMetaCart(addon.value, label, meta.total, currencyCode)
          }
          if (meta.value) {
            metaData.push(meta)
          }
        }
      })
      return metaData
    },

    get total() {
      let total = 0
      self.addons.forEach((addon) => {
        if (addon.checked || addon.required) {
          total += Number(addon.total)

          if (addon.multipleItems) {
            addon.multipleItems
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
  .actions(() => ({
    getTotal: (min: number, value: number, price: number) => {
      /**
       * El total se calcula de la siguiente manera:
       * A la cantidad del complemento se le resta el resultado de restar la
       * cantidad minima menos uno, esto es porque, por ejemplo si se tiene una cantidad
       * minima de 3 y no se hace la resta correspondiente se estaria sumando el precio
       * de tres veces el producto cuando en realidad solo deber ser uno. EL uno se resta
       * porque ya se cuenta el precio del producto en si. Finalmente se multiplica por el precio
       */
      if (min >= 1) return (value - (min - 1)) * price

      return value * price
    },
    getMultipleChoiceWithTitle: (addons: AddonItem[]) => {
      return addons.filter((addon) => addon.title && addon.type?.value === MULTIPLE_CHOICE)
    },
  }))
  .actions((self) => ({
    setAddons: (addons: AddonItemModel[]) => {
      applySnapshot(self.addons, JSON.parse(JSON.stringify(addons)))
    },
    updateAddon: (addon: AddonItemModel) => {
      const index = self.addons.findIndex((item) => item.id === addon.id)

      applySnapshot(self.addons[index], addon)
    },
  }))
  .actions((self) => ({
    initState: (addons: AddonItemModel[]) => {
      const addonsState: AddonItemModel[] = []
      addons.forEach((addon) => {
        // The name property should be used as key in the state because does not exits ID
        let state = {
          ...addon,
          value: getMinValue(addon.required, addon.initialValue),
          total: addon.price,
          label: addon.label,
          min: getMinValue(addon.required, addon.initialValue),
          options: undefined,
          dependencies: undefined,
          checked: false,
        }
        if (addon.type.value === MULTIPLE_CHOICE || addon.type.value === CHECKBOX) {
          state = {
            ...state,
            checked: false,
            options: addon.multipleItems.map((option) => ({
              ...option,
              checked: false,
              disabled: false,
            })),
          }
          if (
            addon.required &&
            addon.type.value !== CHECKBOX &&
            addon.type.value !== MULTIPLE_CHOICE
          )
            state.checked = true
        }
        addonsState.push(state)
      })
      self.setAddons(addonsState)
    },
    changeValueIncrement: (id: string, value: number, isIncrement: boolean) => {
      const addon = self.findAddonById(id)
      addon.value = isIncrement ? value + 1 : value - 1

      if (addon.value >= 1) {
        addon.checked = true
        addon.total = self.getTotal(addon.initialValue, addon.value, addon.price)
      } else {
        addon.checked = false
        addon.total = addon.price
      }

      self.updateAddon(addon)
    },
    calculateTotal(addon: AddonItemModel) {
      addon.total = self.getTotal(addon.initialValue, addon.value, addon.price)
      self.updateAddon(addon)
    },
    changeValueChecked: (id: string, isChecked: boolean) => {
      const addon = self.findAddonById(id)
      addon.checked = isChecked
      if (isChecked) addon.total = addon.price
      else addon.total = 0

      self.updateAddon(addon)
    },
    changeValueCheckedOption: (id: string, optionSelected: Option, isChecked: boolean) => {
      const addon = self.findAddonById(id)

      addon.multipleItems = cast(
        addon.multipleItems.map((option) => {
          if (option.name === optionSelected.name) option.checked = isChecked
          return option
        }),
      )

      const countChecked = addon.multipleItems.filter((option) => option.checked).length
      if (countChecked > 0) addon.checked = true

      self.updateAddon(addon)
    },
    uncheckAllOptions: (id: string) => {
      const addon = self.findAddonById(id)

      addon.multipleItems = cast(
        addon.multipleItems.map((option) => {
          option.checked = false
          return option
        }),
      )

      self.updateAddon(addon)
    },
    onDisableOptions: (id: string, options: Option[], isDisabled: boolean) => {
      const addon = self.findAddonById(id)
      addon.multipleItems = cast(
        addon.multipleItems.map((option) => {
          const includes = options.find((opt) => opt.name === option.name)
          const opt = { ...option }
          if (includes) opt.disabled = isDisabled

          return opt
        }),
      )

      self.updateAddon(addon)
    },

    isValidAddonsMultiChoice: (addons: AddonItem[]) => {
      let isValid = true
      if (self.getMultipleChoiceWithTitle(addons).length > 0) {
        self.getMultipleChoiceWithTitle(addons).forEach((addon) => {
          const selected = addon.multipleItems.filter((option) => option.checked).length

          if (selected < addon.optionsQuantity) isValid = false
        })
      }

      return isValid
    },
    cleanAddons: () => {
      applySnapshot(self.addons, [])
    },
    detachAddons: () => {
      detach(self.addons)
    },
  }))
