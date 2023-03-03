import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { View as AnimatableView } from "react-native-animatable"
import Ripple from "react-native-material-ripple"
import Animated, { BounceInLeft } from "react-native-reanimated"

import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { AddonItem } from "../../models/addons/addon"
import { AddonContext } from "../../screens/dish-detail/dish-detail-screen"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { Card } from "../card/card"
import { Checkbox } from "../checkbox/checkbox"
import { Separator } from "../separator/separator"
import { Text } from "../text/text"

import { Incrementable, IncrementableProps, PriceOption } from "./incrementable-item"
import { useAddon } from "./useAddons"

interface AddonsSectionProps extends IncrementableProps {}

/**
 * Component to show addons form dishes
 */
export const Addons = observer(function Addons() {
  const { getAddonsWithTitle, getAddonsWithoutTitle, getAddonsBoolean } = useAddon()

  const {
    addonStore: {
      addons,
      findAddonByName,
      changeValueIncrement,
      changeValueChecked,
      changeValueCheckedOption,
      uncheckAllOptions,
      onDisableOptions,
    },
  } = useStores()

  if (!findAddonByName(addons[0].name)) return null

  return (
    <View style={utilSpacing.m4}>
      {getAddonsWithTitle(addons).length > 0 && <Separator style={utilSpacing.my5}></Separator>}
      <IncrementableWithTitle
        onPress={(name, value, isIncrement) => changeValueIncrement(name, value, isIncrement)}
      ></IncrementableWithTitle>

      {getAddonsWithoutTitle(addons).concat(getAddonsBoolean(addons)).length > 0 && (
        <View>
          <Separator style={utilSpacing.my5}></Separator>
          <Text preset="bold" tx="addons.chooseYourAddons" style={utilSpacing.mb3}></Text>
        </View>
      )}
      <IncrementableWithoutTitle
        onPress={(name, value, isIncrement) => changeValueIncrement(name, value, isIncrement)}
      ></IncrementableWithoutTitle>

      <OptionBoolean
        onChecked={(name, isChecked) => changeValueChecked(name, isChecked)}
      ></OptionBoolean>

      <MultipleChoice
        onCheckedOption={(name, option, isChecked) =>
          changeValueCheckedOption(name, option, isChecked)
        }
        uncheckAllOptions={(name) => uncheckAllOptions(name)}
        onDisableOptions={(name, options, isDisabled) =>
          onDisableOptions(name, options, isDisabled)
        }
      ></MultipleChoice>
    </View>
  )
})
/**
 * Show addons with title. As long as the addon is incrementable, show title is true and multiple choice type
 */
const IncrementableWithTitle = (props: AddonsSectionProps) => {
  const { getAddonsWithTitle } = useAddon()
  const {
    addonStore: { addons },
  } = useStores()
  const addonsWithTitle = getAddonsWithTitle(addons)

  if (addonsWithTitle.length === 0) return null
  return (
    <>
      {addonsWithTitle.map((addon) => (
        <View key={addon.name}>
          <AnimatableView>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <Text preset="bold" text={addon.name}></Text>
              {addon.required === 1 && <Text style={styles.textRequired} text="*"></Text>}
            </View>
            <Incrementable {...props} addon={addon}></Incrementable>
          </AnimatableView>
        </View>
      ))}
    </>
  )
}

const IncrementableWithoutTitle = (props: AddonsSectionProps) => {
  const { getAddonsWithoutTitle } = useAddon()
  const {
    addonStore: { addons },
  } = useStores()
  const addonsWithoutTitle = getAddonsWithoutTitle(addons)

  if (addonsWithoutTitle.length === 0) return null

  return (
    <View>
      {addonsWithoutTitle.map((addon) => (
        <Incrementable key={addon.name} {...props} addon={addon}></Incrementable>
      ))}
    </View>
  )
}

const OptionBoolean = observer((props: AddonsSectionProps) => {
  const { getAddonsBoolean } = useAddon()
  const {
    addonStore: { addons },
  } = useStores()
  const addonsBoolean = getAddonsBoolean(addons)
  const {
    addonStore: { findAddonByName },
  } = useStores()

  if (addonsBoolean.length === 0) return null

  return (
    <>
      {addonsBoolean.map((addon) => (
        <Ripple
          onPress={() => props.onChecked(addon.name, !findAddonByName(addon.name).checked)}
          rippleOpacity={0.2}
          rippleDuration={400}
          key={addon.name}
          style={utilSpacing.mb4}
        >
          <Card style={utilFlex.flexCenterVertical}>
            <Checkbox
              value={findAddonByName(addon.name)?.checked}
              preset="medium"
              text={addon.label}
              style={utilFlex.flex1}
            ></Checkbox>
            <PriceOption
              amout={Number(addon.options[0].price)}
              isVisiblePlus={findAddonByName(addon.name)?.checked}
            ></PriceOption>
          </Card>
        </Ripple>
      ))}
    </>
  )
})

const MultipleChoice = observer((props: AddonsSectionProps) => {
  const {
    addonStore: { addons },
  } = useStores()
  const { getAddonsMultileChoice } = useAddon()
  const {
    addonStore: { getNumberOptionSelectables },
  } = useStores()
  const addonsMultipleChoice = getAddonsMultileChoice(addons)
  const {
    cartStore,
    addonStore: { findAddonByName },
  } = useStores()
  const [positions, setPositions] = useState({})
  const [nameAddonRequired, setNameAddonRequired] = useState("")
  const { onChangeScrollPosition } = useContext(AddonContext)

  useEffect(() => {
    if (nameAddonRequired.length > 0 && positions[nameAddonRequired]) {
      onChangeScrollPosition(positions[nameAddonRequired])
      setNameAddonRequired("")
    }
  }, [positions, nameAddonRequired])

  const validCheckedOption = (addon: AddonItem, index: number, option: any, isChecked: boolean) => {
    let countSelected = findAddonByName(addon.name)?.options.filter((option) => option.checked)
      .length

    if (isChecked) countSelected++
    else countSelected--

    if (addon.hash?.length > 0) {
      const currentValueSelected = Number(
        findAddonByName(addon.name).options.find((option) => option.checked)?.label,
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
        const optionsDisabled = findAddonByName(addonDependency.name).options.filter(
          (opt) => opt.disabled,
        )
        if (optionsDisabled.length > 0)
          props.onDisableOptions(
            addonDependency.name,
            findAddonByName(addonDependency.name).options,
            false,
          )
      }
    }

    if (getNumberOptionSelectables(addon, addons) === 1) {
      // if only one option is selectable, then uncheck all other options
      props.uncheckAllOptions(addon.name)
      props.onCheckedOption(addon.name, option, true)
    }

    if (getNumberOptionSelectables(addon, addons) > 1) {
      // Si el numero maximo de opciones seleccionables es igual a la cantidad de opciones
      // selecionadas, "disable" las opciones que no estan seleccionadas

      if (getNumberOptionSelectables(addon, addons) === countSelected) {
        const unselected = findAddonByName(addon.name).options.filter(
          (opt) => !opt.checked && opt.label !== option.label,
        )

        props.onDisableOptions(addon.name, unselected, true)
      } else {
        // If exists someone disbled, enable all options
        const optionsDisabled = findAddonByName(addon.name).options.filter((opt) => opt.disabled)
        if (optionsDisabled.length > 0)
          props.onDisableOptions(addon.name, findAddonByName(addon.name).options, false)
      }

      props.onCheckedOption(addon.name, option, isChecked)
    }
  }

  const getSubtite = (addon: AddonItem) => {
    const choice = getI18nText("addons.choice")

    const optionSelectables = getNumberOptionSelectables(addon, addons)

    const option = getI18nText(
      addon.numOptionSelectables === 1 ? "addons.option" : "addons.options",
    )

    return `${choice} ${optionSelectables} ${option}`
  }

  if (addonsMultipleChoice.length === 0) return null

  return (
    <>
      <Separator style={utilSpacing.my5}></Separator>

      {addonsMultipleChoice.map((addon) => (
        <View
          key={addon.name}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout
            if (!positions[addon.name]) {
              setPositions({ ...positions, [addon.name]: y })
            }
          }}
        >
          {getNumberOptionSelectables(addon, addons) > 0 && (
            <View style={utilSpacing.mb4}>
              <Text text={addon.name} preset="bold"></Text>

              <Text
                size="sm"
                caption
                text={getSubtite(addon)}
                style={[utilSpacing.mb3, utilSpacing.mt2]}
              ></Text>

              {addon.required === 1 && cartStore.isSubmited && (
                <Required
                  addon={addon}
                  addons={addons}
                  onLayout={() => setNameAddonRequired(addon.name)}
                ></Required>
              )}

              {addon.options.map((option, index) => (
                <OptionMultiChoice
                  key={option.label}
                  option={option}
                  addon={addon}
                  index={index}
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
  addon: AddonItem
  index: number
  validCheckedOption: (addon: AddonItem, index: number, option: any, isChecked: boolean) => void
}

const OptionMultiChoice = (props: OptionMultiChoiceProos) => {
  const { option, addon, index, validCheckedOption } = props
  const [isDisabled, setIsDisabled] = useState(false)
  const {
    addonStore: { findAddonByName },
  } = useStores()

  useEffect(() => {
    setIsDisabled(findAddonByName(addon.name).options[index].disabled)
  }, [findAddonByName(addon.name).options[index].disabled])

  return (
    <View key={option.label}>
      {isDisabled && <View style={styles.optionDisabled}></View>}
      <Ripple
        onPress={() =>
          !isDisabled &&
          validCheckedOption(
            addon,
            index,
            option,
            !findAddonByName(addon.name).options[index].checked,
          )
        }
        rippleOpacity={isDisabled ? 0 : 0.2}
        rippleDuration={400}
        style={[utilSpacing.mb4, styles.option]}
      >
        <Card key={option.label} style={utilFlex.flexCenterVertical}>
          <Checkbox
            value={findAddonByName(addon.name).options[index].checked}
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

const Required = observer(
  (props: { addon: AddonItem; addons: AddonItem[]; onLayout: () => void }) => {
    const { addon, addons, onLayout } = props
    const {
      addonStore: { getNumberOptionSelectables },
    } = useStores()

    const selectable = getNumberOptionSelectables(addon, addons)
    const selected = addon.options.filter((option) => option.checked).length

    if (selected < selectable) {
      return <RequiredTag onLayout={() => onLayout()}></RequiredTag>
    }

    return null
  },
)

const RequiredTag = (props: { txMessage?: TxKeyPath; onLayout: () => void }) => {
  return (
    <Animated.View
      entering={BounceInLeft}
      style={[utilSpacing.px5, utilSpacing.py3, styles.required, utilSpacing.mb4]}
      onLayout={() => {
        props.onLayout()
      }}
    >
      <Text
        tx={props.txMessage ?? "addons.obligatory"}
        preset="semiBold"
        style={styles.textRequired}
      ></Text>
    </Animated.View>
  )
}

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
    letterSpacing: 1,
  },
})
