import { observer } from "mobx-react-lite"
import React from "react"
import { useController, useFormContext } from "react-hook-form"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import * as Animatable from "react-native-animatable"
import { translate } from "../../i18n"
import { color, spacing, typography } from "../../theme"
import { typographySize } from "../../theme/typography"
import { utilSpacing } from "../../theme/Util"
import { Card } from "../card/card"
import { Text } from "../text/text"
import { InputTextProps } from "./input-text.props"

const TEXT_STYLES: TextStyle = {
  paddingHorizontal: spacing[3],
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
    ...rest
  } = props

  const { field } = useController({ name, rules, defaultValue })

  const stylesInput = Object.assign({}, TEXT_STYLES, style)
  const container = Object.assign({}, CONTAINER, styleContainer)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  const Textinput = () => {
    return (
      <TextInput
        selectionColor={color.palette.grayDark}
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.grayDark}
        underlineColorAndroid={preset === "card" ? color.palette.grayLigth : color.transparent}
        style={stylesInput}
        ref={forwardedRef}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        {...rest}
      />
    )
  }

  if (preset === "normal") {
    return (
      <View style={container}>
        <View style={CONTAINER_INPUT}>
          <Textinput></Textinput>
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
          <Textinput></Textinput>
        </View>
        <ErrorMessage name={name}></ErrorMessage>
      </View>
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
