import React, { FunctionComponent, useState } from "react"
import { FlatList, StyleSheet, TextInput, View, ViewStyle } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"

import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { Text } from "../text/text"
/**
 * Prediction's type returned from Google Places Autocomplete API
 * https://developers.google.com/places/web-service/autocomplete#place_autocomplete_results
 */
export type PredictionType = {
  description: string
  placeId: string
  reference: string
  matchedSubstrings: any[]
  tructuredFormatting: tructuredFormattingType
  terms: termsType[]
  types: string[]
}
type tructuredFormattingType = {
  mainText: string
  mainTextMatchedSubstrings: any[]
  secondaryText: string
}

type termsType = {
  value: string
  offset: number
}

type SearchBarProps = {
  value: string
  style?: ViewStyle | ViewStyle[]
  onChangeText: (text: string) => void
  predictions: PredictionType[]
  isLoading: boolean
  onPredictionTapped: (placeId: string, description: string) => void
}

const SearchBarWithAutocomplete: FunctionComponent<SearchBarProps> = (props) => {
  const { value, style, onChangeText, onPredictionTapped, predictions, isLoading } = props
  const [inputSize, setInputSize] = useState({ width: 0, height: 0 })
  const passedStyles = Array.isArray(style) ? Object.assign({}, ...style) : style

  const renderPredictions = (predictions: PredictionType[]) => {
    const calculatedStyle = {
      width: inputSize.width,
    }

    return (
      <ScrollView horizontal={true} keyboardShouldPersistTaps={"handled"}>
        <FlatList
          keyboardShouldPersistTaps={"handled"}
          data={predictions}
          renderItem={({ item }) => {
            return (
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                style={[styles.predictionRow, utilSpacing.py5]}
                onPress={() => onPredictionTapped(item.placeId, item.description)}
              >
                <Text numberOfLines={1}>{item.description}</Text>
              </Ripple>
            )
          }}
          keyExtractor={(item) => item.placeId}
          style={calculatedStyle}
        />
      </ScrollView>
    )
  }

  return (
    <View style={[styles.container, { ...passedStyles }]}>
      <TextInput
        style={[styles.inputStyle, utilSpacing.px5, utilSpacing.py5, utilSpacing.mb3]}
        placeholder={getI18nText("modalAutocomplete.placeholderSearch")}
        placeholderTextColor={color.palette.grayDark}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onLayout={(event) => {
          const { height, width } = event.nativeEvent.layout
          setInputSize({ height, width })
        }}
      ></TextInput>
      {isLoading && (
        <ProgressBar
          height={2}
          indeterminate
          backgroundColor={color.palette.grayDark}
          trackColor={color.palette.grayLigth}
        />
      )}

      {!isLoading && renderPredictions(predictions)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  inputStyle: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: spacing[2],
    color: color.text,
  },
  predictionRow: {
    borderBottomColor: color.palette.grayLigth,
    borderBottomWidth: 1,
  },
})

export default SearchBarWithAutocomplete
