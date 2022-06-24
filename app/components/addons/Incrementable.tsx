import React, { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
  ZoomOut,
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
    addon: { required, name, label_option: labelOption, min },
    state,
  } = props

  const offset = useSharedValue(required === 1 ? 60 : 0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  const [isVisibleMinus, setIsVisibleMinus] = useState(required === 1)

  useEffect(() => {
    if (Number(state[name].value) === 0) {
      setIsVisibleMinus(false)
      offset.value = withSpring(0)
    }
  }, [state[name].value])

  const plus = () => {
    if (isVisibleMinus) onPress(name, Number(state[name].value), true)
    else {
      setIsVisibleMinus(true)
      offset.value = withSpring(60)
      onPress(name, Number(state[name].value), true)
    }
  }

  const minus = () => {
    // Se valida si el valor es mayor o igual al valor minimo requerido para el campo
    if (Number(state[name].value) - 1 >= min) {
      onPress(name, Number(state[name].value), false)
    } else {
      // Si no es requerido, se oculta el boton de restar y se hace la resta correspondiente
      if (required !== 1) {
        setIsVisibleMinus(false)
        offset.value = withSpring(0)
        onPress(name, Number(state[name].value), false)
      }
    }
  }

  return (
    <Card style={[styles.card, utilSpacing.mb4, utilSpacing.p0, utilFlex.flexCenterVertical]}>
      <Animated.View
        style={[styles.box, utilFlex.flexCenterVertical, utilSpacing.mx4, animatedStyles]}
      >
        <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
          <TouchableOpacity
            onPress={() => plus()}
            style={[styles.btnRounded, utilSpacing.my4, utilFlex.flexCenter]}
          >
            <IconRN name="add" color={color.palette.black} size={24}></IconRN>
          </TouchableOpacity>

          <Text numberOfLines={1} style={utilSpacing.ml4} text={labelOption}></Text>
        </View>
      </Animated.View>

      <View style={utilFlex.flexCenterVertical}>
        <View
          style={[
            utilFlex.flexRow,
            utilSpacing.px4,
            utilFlex.flexCenterVertical,
            utilFlex.flex1,
            styles.zIndex9,
          ]}
        >
          {isVisibleMinus && (
            <Animated.View entering={ZoomIn} exiting={ZoomOut}>
              <TouchableOpacity
                onPress={() => minus()}
                style={[styles.btnRounded, utilSpacing.my4, utilFlex.flexCenter]}
              >
                <IconRN name="remove" color={color.palette.black} size={24}></IconRN>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Text numberOfLines={1} text={`${state[name].value}`} style={styles.text}></Text>
        </View>
        <PriceOption
          amout={Number(state[name].total)}
          isVisiblePriceUnity={Number(state[name].value) > 1}
          priceUnity={Number(state[name].price)}
          isVisiblePlus={isVisibleMinus}
        ></PriceOption>
      </View>
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
      <View style={styles.containerPrice}>
        <View style={utilFlex.felxColumn}>
          <View style={utilFlex.flexRow}>
            {isVisiblePlus && (
              <Animated.Text entering={ZoomIn}>
                <Text text="+"></Text>
              </Animated.Text>
            )}
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
  box: {
    backgroundColor: color.background,
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
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
  containerPrice: {
    paddingVertical: 30,
    position: "absolute",
    right: 0,
    zIndex: 20,
  },

  price: {
    backgroundColor: color.background,
    right: 0,
  },
  text: {
    minWidth: 30,
    textAlign: "center",
  },

  zIndex9: {
    zIndex: 9,
  },
})
