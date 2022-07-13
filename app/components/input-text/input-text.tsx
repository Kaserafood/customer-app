import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import * as Animatable from "react-native-animatable"
import TextInputMask from "react-native-text-input-mask"
import { translate } from "../../i18n"
import { color, spacing, typography } from "../../theme"
import { typographySize } from "../../theme/typography"
import { utilSpacing } from "../../theme/Util"
import { Card } from "../card/card"
import { Text } from "../text/text"
import { InputTextProps } from "./input-text.props"

const TEXT_STYLES: TextStyle = {
  paddingVertical: spacing[3],
  fontFamily: typography.primary,
  marginBottom: -3,
  fontSize: typographySize.md,
  color: color.text,
}
const TEXT_ERROR: TextStyle = {
  color: color.error,
  fontSize: typographySize.sm,
}
const CONTAINER_ERROR: ViewStyle = {
  position: "absolute",
  bottom: -18,
}
const CONTAINER_INPUT: ViewStyle = {
  backgroundColor: color.palette.grayLigth,
  borderRadius: spacing[2],
}

const CONTAINER_INPUT_CARD: ViewStyle = {
  borderRadius: spacing[2],
}
const CONTAINER: ViewStyle = {
  width: "100%",
}

export const InputText = (props: InputTextProps) => {
  const { name } = props

  const formContext = useFormContext()

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined"
    console.error(msg)
    return null
  }

  return <ControlledInput {...props} />
}

const ControlledInput = observer(function InputText(props: InputTextProps) {
  const {
    style,
    styleContainer,
    placeholder,
    forwardedRef,
    placeholderTx,
    name,
    labelTx,
    rules,
    defaultValue,
    styleLabel,
    preset = "normal",
    mask,
    counter,
    iconRight,
    ...rest
  } = props

  const { field } = useController({ name, rules, defaultValue })

  const stylesInput = Object.assign({}, TEXT_STYLES, style)
  const container = Object.assign({}, CONTAINER, styleContainer)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  const [strLenght, setStrLenght] = useState(0)

  useEffect(() => {
    if (counter) {
      setStrLenght(field?.value?.length || 0)
    }
  }, [field.value])

  if (preset === "normal") {
    return (
      <View style={container}>
        <View style={CONTAINER_INPUT}>
          <TextInputMask
            selectionColor={color.palette.grayDark}
            placeholder={actualPlaceholder}
            placeholderTextColor={color.palette.grayDark}
            underlineColorAndroid={color.transparent}
            style={[stylesInput, utilSpacing.px3]}
            ref={forwardedRef}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            mask={mask}
            {...rest}
          />
        </View>
        <ErrorMessage name={name}></ErrorMessage>
      </View>
    )
  }

  return (
    <Card
      style={[utilSpacing.pb6, utilSpacing.px5, utilSpacing.mx4, utilSpacing.mb4, styleContainer]}
    >
      <View>
        <View style={CONTAINER_INPUT_CARD}>
          {labelTx && (
            <Text tx={labelTx} style={[utilSpacing.mt3, styleLabel]} preset="semiBold"></Text>
          )}
          <TextInputMask
            selectionColor={color.palette.grayDark}
            placeholder={actualPlaceholder}
            placeholderTextColor={color.palette.grayDark}
            underlineColorAndroid={color.palette.grayLigth}
            style={stylesInput}
            ref={forwardedRef}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            mask={mask}
            {...rest}
          />
          {iconRight && <View style={styles.iconRightCard}>{iconRight}</View>}
        </View>

        <ErrorMessage name={name}></ErrorMessage>
      </View>
      {counter && (
        <View style={styles.containerCounter}>
          <Text size="sm" style={styles.counter} text={`${strLenght}/${counter}`}></Text>
        </View>
      )}
    </Card>
  )
})

const ErrorMessage = (props: { name: string }) => {
  const { name } = props
  const formContext = useFormContext()

  const { formState } = formContext
  const hasError = Boolean(formState?.errors[name])

  if (hasError && formState.errors[name].message) {
    return (
      <Animatable.Text style={CONTAINER_ERROR} animation="shake">
        <Text style={TEXT_ERROR} tx={formState.errors[name].message}></Text>
      </Animatable.Text>
    )
  }

  return null
}

const styles = StyleSheet.create({
  containerCounter: {
    bottom: 10,
    position: "absolute",
    right: 16,
  },
  counter: {
    color: color.palette.grayDark,
    position: "relative",
    textAlign: "right",
    width: "100%",
  },
  iconRightCard: {
    position: "absolute",
    right: 5,
    backgroundColor: color.background,
    bottom: 16,
  },
})
