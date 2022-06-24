import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Addon } from "../../models/dish"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { Card } from "../card/card"
import { Price } from "../price/price"
import { Text } from "../text/text"

export interface IncrementableProps {
  onPress?: (name: string, value: number, isIncrement: boolean) => void
  onChecked?: (name: string, isChecked: boolean) => void
  onCheckedOption?: (name: string, option: any, isChecked: boolean) => void
  uncheckAllOptions?: (name: string) => void
  onDisableOptions?: (name: string, options: any, isDisabled: boolean) => void
  addon?: Addon
  state: any
}

export const Incrementable = function Incrementable(props: IncrementableProps) {
  const {
    onPress,
    addon: { required, name, label_option: labelOption },
    state,
  } = props

  let min = props.addon.min

  const offset = useSharedValue(0)

  const config = {
    duration: 800,
    easing: Easing.bezierFn(0.5, 0.01, 0, 1),
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: withTiming(offset.value, config),
    }
  })

  const [isVisibleMinus, setIsVisibleMinus] = useState(required === 1)

  if (min === 0) min = 1

  const plus = () => {
    offset.value = 30
    if (isVisibleMinus) onPress(name, Number(state[name].value), true)
    else {
      setIsVisibleMinus(true)
      onPress(name, Number(state[name].value), true)
    }
  }

  const minus = () => {
    console.log(required, ` ${min}`)
    // Se valida si el valor es mayor o igual al valor minimo requerido para el campo
    if (Number(state[name].value) - 1 >= min) {
      onPress(name, Number(state[name].value), false)
    } else {
      // Si no es requerido, se oculta el boton de restar y se hace la resta correspondiente
      if (required !== 1) {
        setIsVisibleMinus(false)
        offset.value = 0
        onPress(name, Number(state[name].value), false)
      }
    }
  }

  return (
    <Card style={[styles.card, utilSpacing.mb4, utilFlex.flexCenterVertical]}>
      {isVisibleMinus && (
        <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
          <Animated.View style={animatedStyles}>
            <TouchableOpacity
              onPress={() => minus()}
              style={[styles.btnRounded, utilSpacing.my4, utilFlex.flexCenter]}
            >
              <IconRN name="remove" color={color.palette.black} size={24}></IconRN>
            </TouchableOpacity>
          </Animated.View>

          <Text numberOfLines={1} text={`${state[name].value}`} style={utilSpacing.mx4}></Text>
        </View>
      )}

      <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
        <TouchableOpacity
          onPress={() => plus()}
          style={[styles.btnRounded, utilSpacing.my4, utilFlex.flexCenter]}
        >
          <IconRN name="add" color={color.palette.black} size={24}></IconRN>
        </TouchableOpacity>
      </View>

      <Text numberOfLines={1} style={[utilSpacing.ml4, utilFlex.flex1]} text={labelOption}></Text>

      <PriceOption
        amout={Number(state[name].total)}
        isVisiblePriceUnity={Number(state[name].value) > 1}
        priceUnity={Number(state[name].price)}
        isVisiblePlus={isVisibleMinus}
      ></PriceOption>
    </Card>
  )
}

export const PriceOption = (props: {
  amout: number
  isVisiblePriceUnity?: boolean
  isVisiblePlus?: boolean
  priceUnity?: number
}) => {
  const { amout, isVisiblePriceUnity, priceUnity, isVisiblePlus } = props

  if (amout > 0) {
    return (
      <View>
        <View style={utilFlex.felxColumn}>
          <View style={utilFlex.flexRow}>
            {isVisiblePlus && <Text text="+"></Text>}
            <Price
              preset="simple"
              textStyle={[utilSpacing.pr4, utilSpacing.pl2]}
              amount={amout}
            ></Price>
          </View>

          {isVisiblePriceUnity && (
            <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
              <View style={utilFlex.flexRow}>
                <Price
                  preset="simple"
                  style={[styles.price, utilSpacing.px1]}
                  textStyle={[utilText.textGray, utilText.textSm]}
                  amount={priceUnity}
                ></Price>
                <Text caption size="sm" tx="addons.each"></Text>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  btnRounded: {
    backgroundColor: color.palette.grayLigth,
    borderRadius: 24,
    height: 30,
    width: 30,
  },
  card: {
    height: 48,
    overflow: "hidden",
    zIndex: 10,
  },

  price: {
    backgroundColor: color.background,
    right: 0,
  },
})
