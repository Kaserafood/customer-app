import { AddonItem, CHECKBOX, MULTIPLE_CHOICE, TRUE } from "../../models/addons/addon"

export function getTotal(min: number, value: number, price: number) {
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
}

export function isDependencyQuantity(addon: AddonItem) {
  return addon.dependencies?.hash?.length > 0 && addon.dependencies?.quantity === TRUE
}

export function getAddonsMultileChoice(addons: AddonItem[]) {
  return addons.filter(
    (addon) =>
      addon.showTitle === TRUE &&
      addon.multipleChoice === TRUE &&
      (addon.type === MULTIPLE_CHOICE || addon.type === CHECKBOX),
  )
}
