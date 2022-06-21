import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import { Addon } from "../../models/dish"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"
import { Incrementable, IncrementableProps, PriceOption } from "./Incrementable"
import { StateHandler } from "./stateHandler"
import { useAddon } from "./useAddons"

interface AddonsSectionProps extends IncrementableProps {
  addons: Addon[]
}
const TRUE = "yes"
const FALSE = ""
const MULTIPLE_CHOICE = "multiple_choice"
const INPUT_MULTIPLER = "input_multiplier"
export interface AddonsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Addons to display
   */
  addons: Addon[]
}

const stateHandler = new StateHandler()

/**
 * Component to show addons form dishes
 */
export const Addons = observer(function Complements(props: AddonsProps) {
  const { style, addons } = props

  const {
    initState,
    changeValueIncrement,
    changeValueChecked,
    changeValueCheckedOption,
    uncheckAllOptions,
    onDisableOptions,
  } = useAddon(stateHandler, addons)

  useEffect(() => {
    initState()
  }, [])

  if (!stateHandler.state[addons[0].name]) return null

  return (
    <View style={[style, utilSpacing.m4]}>
      <IncrementableWithTitle
        onPress={(name, value, isIncrement) => changeValueIncrement(name, value, isIncrement)}
        state={stateHandler.state}
        addons={addons}
      ></IncrementableWithTitle>

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

      <Text text={`TOTAL A PAGAR: ${stateHandler.total}`}></Text>
    </View>
  )
})
/**
 * Show addons with title. As long as the addon is incrementable, show title is true and multiple choice type
 */
const IncrementableWithTitle = (props: AddonsSectionProps) => {
  const addonsWithTitle = props.addons.filter(
    (addon) =>
      addon.show_title === TRUE && addon.incrementable === TRUE && addon.type === MULTIPLE_CHOICE,
  )
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
  const addonsWithoutTitle = props.addons.filter(
    (addon) =>
      addon.show_title === FALSE && addon.incrementable === TRUE && addon.type === INPUT_MULTIPLER,
  )

  if (addonsWithoutTitle.length === 0) return null

  return (
    <>
      <Separator style={utilSpacing.my5}></Separator>
      <Text preset="bold" tx="addons.chooseYourAddons" style={utilSpacing.mb3}></Text>
      {addonsWithoutTitle.map((addon) => (
        <Incrementable key={addon.name} {...props} addon={addon}></Incrementable>
      ))}
    </>
  )
}

const OptionBoolean = (props: AddonsSectionProps) => {
  const addonsBoolean = props.addons.filter(
    (addon) =>
      addon.show_title === FALSE && addon.option_boolean === TRUE && addon.type === MULTIPLE_CHOICE,
  )

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
              value={props.state[addon.name].checked}
              preset="medium"
              text={addon.label_option}
              style={utilFlex.flex1}
            ></Checkbox>
            <PriceOption amout={Number(addon.options[0].price)}></PriceOption>
          </Card>
        </Ripple>
      ))}
    </>
  )
}

const MultipleChoice = (props: AddonsSectionProps) => {
  const { state } = props
  const addonsMultipleChoice = props.addons.filter(
    (addon) =>
      addon.show_title === TRUE && addon.multiple_choice === TRUE && addon.type === MULTIPLE_CHOICE,
  )

  const validCheckedOption = (addon: Addon, index: number, option: any, isChecked: boolean) => {
    let countSelected = state[addon.name].options.filter((option) => option.checked).length
    if (isChecked) countSelected++
    else countSelected--
    if (Number(addon.num_option_selectables) === 1) {
      // if only one option is selectable, then uncheck all other options
      props.uncheckAllOptions(addon.name)
      props.onCheckedOption(addon.name, option, true)
    }

    if (Number(addon.num_option_selectables) > 1) {
      // Si el numero maximo de opciones seleccionables es igual a la cantidad de opciones
      // selecionadas, "disable" las opciones que no estan seleccionadas
      if (Number(addon.num_option_selectables) === countSelected) {
        const unselected = state[addon.name].options.filter(
          (opt) => !opt.checked && opt.label !== option.label,
        )

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
          <Text text={addon.name} preset="bold"></Text>
          <Text
            size="sm"
            caption
            text={`${getI18nText("addons.choice")} ${addon.num_option_selectables} ${getI18nText(
              Number(addon.num_option_selectables) === 1 ? "addons.option" : "addons.options",
            )}`}
            style={utilSpacing.mb3}
          ></Text>
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
      ))}
    </>
  )
}

interface OptionMultiChoiceProos {
  option: any
  addon: Addon
  index: number
  state: any
  validCheckedOption: (addon: Addon, index: number, option: any, isChecked: boolean) => void
}

const OptionMultiChoice = (props: OptionMultiChoiceProos) => {
  const { option, addon, index, state, validCheckedOption } = props

  return (
    <View key={option.label}>
      <View
        style={[styles.disabled, state[addon.name].options[index].disabled && styles.h48]}
      ></View>

      <Ripple
        onPress={() =>
          validCheckedOption(addon, index, option, !state[addon.name].options[index].checked)
        }
        rippleOpacity={0.2}
        rippleDuration={400}
        style={utilSpacing.mb4}
      >
        <Card key={option.label} style={utilFlex.flexCenterVertical}>
          <Checkbox
            value={state[addon.name].options[index].checked}
            preset="medium"
            text={option.label}
            style={utilFlex.flex1}
          ></Checkbox>
          <PriceOption amout={Number(option.price)}></PriceOption>
        </Card>
      </Ripple>
    </View>
  )
}

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: color.palette.grayDisabled,
    borderRadius: spacing[2],
    height: 0,
    position: "absolute",
    width: "100%",
    zIndex: 15,
  },
  h48: {
    height: 48,
  },

  textRequired: {
    color: color.primary,
  },
})
