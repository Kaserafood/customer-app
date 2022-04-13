import * as React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, TextInput } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Text } from "../text/text"

import { spacing } from "../../theme/spacing"
import { useState } from "react"
import { translate, TxKeyPath } from "../../i18n"

export interface InputTextCardProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Title of the card
   */
  title?: string

  /**
   * Title of the card
   */
  titleTx?: string

  /**
   * Place holder of the input
   */
  placeholder?: string

  /***
   * Counter world of the input
   */
  counter?: number
}

/**
 * Describe your component here
 */
export const InputTextCard = observer(function InputTextCard(props: InputTextCardProps) {
  const { style, title, placeholder, counter, placeholderTx, titleTx } = props
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  const actualTitle = titleTx ? translate(titleTx) : title
  const [strLenght, setStrLenght] = useState(0)

  return (
    <View style={[styles.card, style]}>
      <Text preset="bold" text={actualTitle}></Text>
      <TextInput
        selectionColor={color.palette.grayDark}
        onChange={(e) => setStrLenght(e.nativeEvent.text.length)}
        maxLength={counter}
        style={styles.input}
        placeholder={actualPlaceholder}
      ></TextInput>
      {counter && (
        <View>
          <Text size="sm" style={styles.counter} text={`${strLenght}/${counter}`}></Text>
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[2],
    elevation: 5,
    padding: spacing[3],
    shadowColor: color.palette.grayDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,

    shadowRadius: 3.84,
  },
  counter: {
    color: color.palette.grayDark,
    position: "relative",
    textAlign: "right",
    width: "100%",
  },
  input: {
    borderBottomColor: color.palette.grayLigth,
    borderBottomWidth: 1,
    marginBottom: spacing[2],
    paddingVertical: 0,
  },
})
