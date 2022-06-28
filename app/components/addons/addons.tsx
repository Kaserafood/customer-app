import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import Animated, { ZoomIn } from "react-native-reanimated"
import { useStores } from "../../models"
import { Addon } from "../../models/dish"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"
import { Incrementable, IncrementableProps, PriceOption } from "./incrementable"
import { StateHandler } from "./stateHandler"
import { useAddon } from "./useAddons"

interface AddonsSectionProps extends IncrementableProps {
  addons: Addon[]
}

export interface AddonsProps {
  /**
   * Addons to display
   */
  addons: Addon[]

  /**
   * Callback when total price changes
   */
  onTotalPriceChange: (totalPrice: number) => void
}

const stateHandler = new StateHandler()

export const getMetaData = () => {
  return stateHandler.getMetaData()
}

export const isValidAddons = (addons: Addon[]): boolean => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isValidAddonsMultiChoice } = useAddon()
  return isValidAddonsMultiChoice(addons, stateHandler.getState())
}

/**
 * Component to show addons form dishes
 */
export const Addons = observer(function Addons(props: AddonsProps) {
  const { addons } = props

  const {
    initState,
    changeValueIncrement,
    changeValueChecked,
    changeValueCheckedOption,
    uncheckAllOptions,
    onDisableOptions,
    getAddonsWithTitle,
    getAddonsWithoutTitle,
    getAddonsBoolean,
  } = useAddon(stateHandler)

  useEffect(() => {
    initState(addons)
    __DEV__ && console.log("Addons", JSON.parse(JSON.stringify(addons)))
  }, [addons])

  useEffect(() => {
    props.onTotalPriceChange(stateHandler.total)
  }, [stateHandler.total])

  if (!stateHandler.state[addons[0].name]) return null

  return (
    <View style={utilSpacing.m4}>
      {getAddonsWithTitle(addons).length > 0 && <Separator style={utilSpacing.my5}></Separator>}
      <IncrementableWithTitle
        onPress={(name, value, isIncrement) => changeValueIncrement(name, value, isIncrement)}
        state={stateHandler.state}
        addons={addons}
      ></IncrementableWithTitle>

      {getAddonsWithoutTitle(addons).concat(getAddonsBoolean(addons)).length > 0 && (
        <View>
          <Separator style={utilSpacing.my5}></Separator>
          <Text preset="bold" tx="addons.chooseYourAddons" style={utilSpacing.mb3}></Text>
        </View>
      )}
      <IncrementableWithoutTitle
        onPress={(name, value, isIncrement) => changeValueIncrement(name, value, isIncrement)}
        state={stateHandler.state}
        addons={addons}
      ></IncrementableWithoutTitle>

      <OptionBoolean
        onChecked={(name, isChecked) => changeValueChecked(name, isChecked)}
        state={stateHandler.state}
        addons={addons}
      ></OptionBoolean>

      <MultipleChoice
        onCheckedOption={(name, option, isChecked) =>
          changeValueCheckedOption(name, option, isChecked)
        }
        uncheckAllOptions={(name) => uncheckAllOptions(name)}
        onDisableOptions={(name, options, isDisabled) =>
          onDisableOptions(name, options, isDisabled)
        }
        state={stateHandler.state}
        addons={addons}
      ></MultipleChoice>
    </View>
  )
})
/**
 * Show addons with title. As long as the addon is incrementable, show title is true and multiple choice type
 */
const IncrementableWithTitle = (props: AddonsSectionProps) => {
  const { getAddonsWithTitle } = useAddon()
  const addonsWithTitle = getAddonsWithTitle(props.addons)

  if (addonsWithTitle.length === 0) return null
  return (
    <>
      {addonsWithTitle.map((addon) => (
        <View key={addon.name}>
          <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
            <Text preset="bold" text={addon.name}></Text>
            <Text style={styles.textRequired} text="*"></Text>
          </View>
          <Incrementable {...props} addon={addon}></Incrementable>
        </View>
      ))}
    </>
  )
}

const IncrementableWithoutTitle = (props: AddonsSectionProps) => {
  const { getAddonsWithoutTitle } = useAddon()
  const addonsWithoutTitle = getAddonsWithoutTitle(props.addons)

  if (addonsWithoutTitle.length === 0) return null

  return (
    <View>
      {addonsWithoutTitle.map((addon) => (
        <Incrementable key={addon.name} {...props} addon={addon}></Incrementable>
      ))}
    </View>
  )
}

const OptionBoolean = (props: AddonsSectionProps) => {
  const { getAddonsBoolean } = useAddon()
  const addonsBoolean = getAddonsBoolean(props.addons)

  if (addonsBoolean.length === 0) return null

  return (
    <>
      {addonsBoolean.map((addon) => (
        <Ripple
          onPress={() => props.onChecked(addon.name, !props.state[addon.name].checked)}
          rippleOpacity={0.2}
          rippleDuration={400}
          key={addon.name}
          style={utilSpacing.mb4}
        >
          <Card style={utilFlex.flexCenterVertical}>
            <Checkbox
              value={props.state[addon.name]?.checked}
              preset="medium"
              text={addon.label_option}
              style={utilFlex.flex1}
            ></Checkbox>
            <PriceOption
              amout={Number(addon.options[0].price)}
              isVisiblePlus={props.state[addon.name]?.checked}
            ></PriceOption>
          </Card>
        </Ripple>
      ))}
    </>
  )
}

const MultipleChoice = observer((props: AddonsSectionProps) => {
  const { state, addons } = props
  const { getAddonsMultileChoice, getNumberOptionSelectables } = useAddon()
  const addonsMultipleChoice = getAddonsMultileChoice(addons)
  const { cartStore } = useStores()

  const validCheckedOption = (addon: Addon, index: number, option: any, isChecked: boolean) => {
    let countSelected = state[addon.name].options.filter((option) => option.checked).length

    if (isChecked) countSelected++
    else countSelected--

    if (addon.hash?.length > 0) {
      const currentValueSelected = Number(
        state[addon.name].options.find((option) => option.checked)?.label,
      )

      const addonDependency = addonsMultipleChoice.find(
        (item) => item.dependencies.hash === addon.hash,
      )

      if (Number(option.label) < currentValueSelected) {
        if (addonDependency) {
          props.onDisableOptions(addonDependency.name, addonDependency.options, false)
          props.uncheckAllOptions(addonDependency.name)
        }
      } else {
        const optionsDisabled = state[addonDependency.name].options.filter((opt) => opt.disabled)
        if (optionsDisabled.length > 0)
          props.onDisableOptions(addonDependency.name, state[addonDependency.name].options, false)
      }
    }

    if (getNumberOptionSelectables(addon, addons, state) === 1) {
      // if only one option is selectable, then uncheck all other options
      props.uncheckAllOptions(addon.name)
      props.onCheckedOption(addon.name, option, true)
    }

    if (getNumberOptionSelectables(addon, addons, state) > 1) {
      // Si el numero maximo de opciones seleccionables es igual a la cantidad de opciones
      // selecionadas, "disable" las opciones que no estan seleccionadas

      if (getNumberOptionSelectables(addon, addons, state) === countSelected) {
        const unselected = state[addon.name].options.filter(
          (opt) => !opt.checked && opt.label !== option.label,
        )
        console.log("toUnseletd =", unselected)
        props.onDisableOptions(addon.name, unselected, true)
      } else {
        // If exists someone disbled, enable all options
        const optionsDisabled = state[addon.name].options.filter((opt) => opt.disabled)
        if (optionsDisabled.length > 0)
          props.onDisableOptions(addon.name, state[addon.name].options, false)
      }

      props.onCheckedOption(addon.name, option, isChecked)
    }
  }

  if (addonsMultipleChoice.length === 0) return null

  return (
    <>
      <Separator style={utilSpacing.my5}></Separator>

      {addonsMultipleChoice.map((addon) => (
        <View key={addon.name}>
          {getNumberOptionSelectables(addon, addons, state) > 0 && (
            <View style={utilSpacing.mb4}>
              <Text text={addon.name} preset="bold"></Text>

              <Text
                size="sm"
                caption
                text={`${getI18nText("addons.choice")} ${getNumberOptionSelectables(
                  addon,
                  addons,
                  state,
                )} ${getI18nText(
                  Number(addon.num_option_selectables) === 1 ? "addons.option" : "addons.options",
                )}`}
                style={utilSpacing.mb3}
              ></Text>

              {addon.required === 1 && cartStore.isSubmited && (
                <Required addon={addon} addons={addons} state={state}></Required>
              )}

              {addon.options.map((option, index) => (
                <OptionMultiChoice
                  key={option.label}
                  option={option}
                  addon={addon}
                  index={index}
                  state={state}
                  validCheckedOption={(addon, index, option, isChecked) =>
                    validCheckedOption(addon, index, option, isChecked)
                  }
                ></OptionMultiChoice>
              ))}
            </View>
          )}
        </View>
      ))}
    </>
  )
})

interface OptionMultiChoiceProos {
  option: any
  addon: Addon
  index: number
  state: any
  validCheckedOption: (addon: Addon, index: number, option: any, isChecked: boolean) => void
}

const OptionMultiChoice = (props: OptionMultiChoiceProos) => {
  const { option, addon, index, state, validCheckedOption } = props
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    setIsDisabled(state[addon.name].options[index].disabled)
  }, [state[addon.name].options[index].disabled])

  return (
    <View key={option.label}>
      {isDisabled && <View style={styles.optionDisabled}></View>}
      <Ripple
        onPress={() =>
          !isDisabled &&
          validCheckedOption(addon, index, option, !state[addon.name].options[index].checked)
        }
        rippleOpacity={isDisabled ? 0 : 0.2}
        rippleDuration={400}
        style={[utilSpacing.mb4, styles.option]}
      >
        <Card key={option.label} style={utilFlex.flexCenterVertical}>
          <Checkbox
            value={state[addon.name].options[index].checked}
            preset="medium"
            text={option.label}
            style={utilFlex.flex1}
          ></Checkbox>
          <PriceOption isVisiblePlus amout={Number(option.price ?? 0)}></PriceOption>
        </Card>
      </Ripple>
    </View>
  )
}

const Required = observer((props: { addon: Addon; addons: Addon[]; state: any }) => {
  const { addon, addons, state } = props

  const { getNumberOptionSelectables } = useAddon()

  const selectable = getNumberOptionSelectables(addon, addons, state)
  const selected = state[addon.name].options.filter((option) => option.checked).length

  if (selected < selectable) {
    return (
      <Animated.View
        entering={ZoomIn}
        style={[utilSpacing.px5, utilSpacing.py3, styles.required, utilSpacing.mb4]}
      >
        <Text tx="addons.obligatory" preset="semiBold" style={styles.textRequired}></Text>
      </Animated.View>
    )
  }

  return null
})

const styles = StyleSheet.create({
  option: {
    zIndex: 10,
  },
  optionDisabled: {
    backgroundColor: color.palette.grayDisabled,
    borderRadius: spacing[2],
    height: 48,
    position: "absolute",
    width: "100%",
    zIndex: 15,
  },
  required: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.redLight,
    borderRadius: spacing[2],
  },
  textRequired: {
    color: color.palette.redRequired,
  },
})
