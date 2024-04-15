import { observer } from "mobx-react-lite"
import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { View as AnimatableView } from "react-native-animatable"
import Ripple from "react-native-material-ripple"
import Animated, { BounceInLeft } from "react-native-reanimated"

import { Card } from "../../components/card/card"
import { Checkbox } from "../../components/checkbox/checkbox"
import { Separator } from "../../components/separator/separator"
import { Text } from "../../components/text/text"
import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { AddonItem, Option } from "../../models/addons/addon"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { AddonContext } from "./dish-detail-screen"

import { Incrementable, IncrementableProps, PriceOption } from "./incrementable-item"
import { useAddon } from "./useAddons"

interface AddonsSectionProps extends IncrementableProps {}

/**
 * Component to show addons form dishes
 */
export const Addons = observer(function Addons() {
  const { getIncrementableWithTitle, getAddonsWithoutTitle, getAddonsBoolean } = useAddon()

  const {
    addonStore: {
      addons,
      changeValueIncrement,
      changeValueChecked,
      changeValueCheckedOption,
      uncheckAllOptions,
      onDisableOptions,
    },
  } = useStores()

  return (
    <View style={utilSpacing.m4}>
      {getIncrementableWithTitle(addons).length > 0 && (
        <Separator style={utilSpacing.my5}></Separator>
      )}
      <IncrementableWithTitle onPress={changeValueIncrement}></IncrementableWithTitle>

      {getAddonsWithoutTitle(addons).concat(getAddonsBoolean(addons)).length > 0 && (
        <View>
          <Separator style={utilSpacing.my5}></Separator>
          <Text preset="bold" tx="addons.chooseYourAddons" style={utilSpacing.mb3}></Text>
        </View>
      )}
      <IncrementableWithoutTitle onPress={changeValueIncrement}></IncrementableWithoutTitle>

      <OptionBoolean onChecked={changeValueChecked}></OptionBoolean>

      <MultipleChoice
        onCheckedOption={changeValueCheckedOption}
        uncheckAllOptions={uncheckAllOptions}
        onDisableOptions={onDisableOptions}
      ></MultipleChoice>
    </View>
  )
})
/**
 * Show addons with title. As long as the addon is incrementable, show title is true and multiple choice type
 */
const IncrementableWithTitle = (props: AddonsSectionProps) => {
  const { getIncrementableWithTitle } = useAddon()
  const {
    addonStore: { addons },
  } = useStores()
  const addonsWithTitle = getIncrementableWithTitle(addons)

  if (addonsWithTitle.length === 0) return null
  return (
    <>
      {addonsWithTitle.map((addon) => (
        <View key={addon.title}>
          <AnimatableView>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <Text preset="bold" text={addon.title}></Text>
              {addon.required && <Text style={styles.textRequired} text="*"></Text>}
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
        <Incrementable key={addon.title} {...props} addon={addon}></Incrementable>
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
    addonStore: { findAddonById },
  } = useStores()

  if (addonsBoolean.length === 0) return null

  return (
    <>
      {addonsBoolean.map((addon) => (
        <Ripple
          onPress={() => props.onChecked(addon.id, !findAddonById(addon.id).checked)}
          rippleOpacity={0.2}
          rippleDuration={400}
          key={addon.title}
          style={utilSpacing.mb4}
        >
          <Card style={utilFlex.flexCenterVertical}>
            <Checkbox
              value={findAddonById(addon.id)?.checked}
              preset="medium"
              text={addon.label}
              style={utilFlex.flex1}
            ></Checkbox>
            <PriceOption
              amount={addon.price}
              isVisiblePlus={findAddonById(addon.id)?.checked}
            ></PriceOption>
          </Card>
        </Ripple>
      ))}
    </>
  )
})

const MultipleChoice = observer(
  ({ onCheckedOption, uncheckAllOptions, onDisableOptions }: AddonsSectionProps) => {
    const {
      addonStore: { addons },
    } = useStores()
    const { getMultipleChoice } = useAddon()
    const addonsMultipleChoice = getMultipleChoice(addons)
    const { cartStore } = useStores()
    const [positions, setPositions] = useState({})
    const [nameAddonRequired, setNameAddonRequired] = useState("")
    const { onChangeScrollPosition } = useContext(AddonContext)

    useEffect(() => {
      if (nameAddonRequired.length > 0 && positions[nameAddonRequired]) {
        onChangeScrollPosition(positions[nameAddonRequired])
        setNameAddonRequired("")
      }
    }, [positions, nameAddonRequired])

    const validCheckedOption = (
      addon: AddonItem,
      index: number,
      option: Option,
      isChecked: boolean,
    ) => {
      if (addon.optionsQuantity === 1) {
        // if only one option is selectable, then uncheck all other options
        uncheckAllOptions(addon.id)
        onCheckedOption(addon.id, option, isChecked)
      }

      if (addon.optionsQuantity > 1) {
        let countSelected = addon.multipleItems.filter((option) => option.checked).length

        if (isChecked) countSelected++
        else countSelected--
        // Si el numero maximo de opciones seleccionables es igual a la cantidad de opciones
        // selecionadas, "disable" las opciones que no estan seleccionadas
        onCheckedOption(addon.id, option, isChecked)
        if (addon.optionsQuantity === countSelected) {
          const unselected = addon.multipleItems.filter(
            (opt) => !opt.checked && opt.name !== option.name,
          )

          onDisableOptions(addon.id, unselected, true)
        } else {
          // If exists someone disabled, enable all options
          const optionsDisabled = addon.multipleItems.filter((opt) => opt.disabled)
          if (optionsDisabled.length > 0) onDisableOptions(addon.id, addon.multipleItems, false)
        }
      }
    }

    const getSubtitle = (addon: AddonItem) => {
      const choice = getI18nText("addons.choice")

      const option = getI18nText(addon.optionsQuantity === 1 ? "addons.option" : "addons.options")

      return `${choice} ${addon.optionsQuantity} ${option}`
    }

    if (addonsMultipleChoice.length === 0) return null

    return (
      <>
        <Separator style={utilSpacing.my5}></Separator>

        {addonsMultipleChoice.map((addon) => (
          <View
            key={addon.title}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout
              if (!positions[addon.title]) {
                setPositions({ ...positions, [addon.title]: y })
              }
            }}
          >
            {addon.optionsQuantity > 0 && (
              <View style={utilSpacing.mb4}>
                <Text text={addon.title} preset="bold"></Text>

                <Text
                  size="sm"
                  caption
                  text={getSubtitle(addon)}
                  style={[utilSpacing.mb3, utilSpacing.mt2]}
                ></Text>

                {addon.required && cartStore.isSubmited && (
                  <Required
                    addon={addon}
                    addons={addons}
                    onLayout={() => setNameAddonRequired(addon.title)}
                  ></Required>
                )}

                {addon.multipleItems &&
                  addon.multipleItems.map((option, index) => (
                    <OptionMultiChoice
                      key={option.name}
                      option={option}
                      addon={addon}
                      index={index}
                      validCheckedOption={validCheckedOption}
                    ></OptionMultiChoice>
                  ))}
              </View>
            )}
          </View>
        ))}
      </>
    )
  },
)

interface OptionMultiChoiceProps {
  option: Option
  addon: AddonItem
  index: number
  validCheckedOption: (addon: AddonItem, index: number, option: Option, isChecked: boolean) => void
}

const OptionMultiChoice = observer((props: OptionMultiChoiceProps) => {
  const { option, addon, index, validCheckedOption } = props
  const { disabled, checked, name, price } = option

  return (
    <View key={name}>
      {disabled && <View style={styles.optionDisabled}></View>}
      <Ripple
        onPress={() => !disabled && validCheckedOption(addon, index, option, !checked)}
        rippleOpacity={disabled ? 0 : 0.2}
        rippleDuration={400}
        style={[utilSpacing.mb4, styles.option]}
      >
        <Card key={name} style={utilFlex.flexCenterVertical}>
          <Checkbox value={checked} preset="medium" text={name} style={utilFlex.flex1}></Checkbox>
          <PriceOption isVisiblePlus amount={Number(price ?? 0)}></PriceOption>
        </Card>
      </Ripple>
    </View>
  )
})

const Required = observer(
  (props: { addon: AddonItem; addons: AddonItem[]; onLayout: () => void }) => {
    const { addon, onLayout } = props

    const selected = addon.multipleItems.filter((option) => option.checked).length

    if (selected < addon.optionsQuantity) {
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
