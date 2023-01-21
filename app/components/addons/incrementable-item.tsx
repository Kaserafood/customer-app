import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { observer } from "mobx-react-lite"

import { useStores } from "../../models"
import { AddonItem } from "../../models/addons/addon"
import { AddonContext } from "../../screens/dish-detail/dish-detail-screen"
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
  addon?: AddonItem
}

export const Incrementable = observer((props: IncrementableProps) => {
  const {
    onPress,
    addon,
  } = props

  const { required, name, label, value } = addon
  const [min, setMin] = useState(props.addon.min)
  const [isVisibleMinus, setIsVisibleMinus] = useState(required === 1)
  const offset = useSharedValue(required === 1 ? 30 : 0)

  useEffect(() => {
    if (min === 0) {
      setMin(1)
    }
    if (value > 0) {
      setIsVisibleMinus(true)
      offset.value = 30
    }
  }, [])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: withSpring(offset.value),
    }
  })

  const plus = () => {
    if (!isVisibleMinus) {
      setIsVisibleMinus(true)
      offset.value = 30
    }

    onPress(name, value, true)
  }

  const minus = () => {
    console.log(required, ` ${min}`)
    // Se valida si el valor es mayor o igual al valor minimo requerido para el campo
    if (Number(value) - 1 >= min) {
      onPress(name, Number(value), false)
    } else {
      // Si no es requerido, se oculta el boton de restar y se hace la resta correspondiente
      if (required !== 1) {
        setIsVisibleMinus(false)
        offset.value = 0
        onPress(name, Number(value), false)
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

          <Text numberOfLines={1} text={`${addon.value}`} style={utilSpacing.mx4}></Text>
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

      <Text numberOfLines={1} style={[utilSpacing.ml4, utilFlex.flex1]} text={label}></Text>

      <PriceOption
        amout={addon.total}
        isVisiblePriceUnity={addon.value > 1}
        priceUnity={addon.price}
        isVisiblePlus={isVisibleMinus}
      ></PriceOption>
    </Card>
  )
})

export const PriceOption = (props: {
  amout: number
  isVisiblePriceUnity?: boolean
  isVisiblePlus?: boolean
  priceUnity?: number
}) => {
  const { amout, isVisiblePriceUnity, priceUnity, isVisiblePlus } = props
  const { currencyCode } = useContext(AddonContext)
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
              currencyCode={currencyCode}
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
                  currencyCode={currencyCode}
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
