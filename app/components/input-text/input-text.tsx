import React, { Dispatch, SetStateAction } from "react"
import { StyleProp, TextStyle, View, ViewStyle, TextInputProps, TextInput } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { typographySize } from "../../theme/typography"
import { Text } from "../text/text"
import { useController, useFormContext, ControllerProps, UseControllerProps } from "react-hook-form"
import { delay } from "../../utils/delay"
import * as Animatable from "react-native-animatable"
import AnimatedComponent, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  Transition,
} from "react-native-reanimated"

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
const CONTAINER: ViewStyle = {
  width: "100%",
}

interface InputTextProps extends TextInputProps, UseControllerProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * An optional style override  the InputText style .
   */
  style?: StyleProp<TextStyle>

  /**
   * An optional style override  the Label style .
   */
  styleLabel?: StyleProp<TextStyle>

  /**
   * An optional style override the View container style.
   */
  styleContainer?: StyleProp<ViewStyle>

  /**
   * An optional reference
   */
  forwardedRef?: any

  /**
   * An optional label to display when preset is "card" //TODO: ADD THIS PRESET
   */
  label?: string

  /**
   * Name of the input
   */
  name: string

  /**
   * Default value in the input
   */
  defaultValue?: string

  /**
   * Error handler
   */
  setFormError: Dispatch<SetStateAction<boolean>>
}

const ControlledInput = observer(function InputText(props: InputTextProps) {
  const {
    style,
    styleContainer,
    placeholder,
    forwardedRef,
    placeholderTx,
    name,
    label,
    rules,
    defaultValue,
    styleLabel,
    ...rest
  } = props
  const formContext = useFormContext()
  const { formState } = formContext
  const { field } = useController({ name, rules, defaultValue })
  const hasError = Boolean(formState?.errors[name])

  const stylesInput = Object.assign({}, TEXT_STYLES, style)
  const container = Object.assign({}, CONTAINER, styleContainer)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  return (
    <View style={container}>
      <View style={CONTAINER_INPUT}>
        {label && <Text style={styleLabel}>{label}</Text>}

        <TextInput
          selectionColor={color.palette.grayDark}
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.grayDark}
          underlineColorAndroid={color.transparent}
          style={stylesInput}
          ref={forwardedRef}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          {...rest}
        />
      </View>

      {hasError && (
        <Animatable.Text style={CONTAINER_ERROR} animation="shake">
          <Text style={TEXT_ERROR} tx={formState.errors[name].message}></Text>
        </Animatable.Text>
      )}
    </View>
  )
})

export const InputText = (props: InputTextProps) => {
  const { name, setFormError } = props

  const formContext = useFormContext()

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined"
    console.error(msg)
    setFormError(true)
    return null
  }

  return <ControlledInput {...props} />
}
