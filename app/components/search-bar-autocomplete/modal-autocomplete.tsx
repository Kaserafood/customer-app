import React, { useState } from "react"
import SearchBarWithAutocomplete, { PredictionType } from "./search-bar-autocomplete"
import { StyleSheet, View } from "react-native"

import { Icon } from "../icon/icon"
import { Modal } from "../modal/modal"
import { ModalStateHandler } from "../../utils/modalState"
import { Text } from "../text/text"
import { TouchableOpacity } from "react-native-gesture-handler"
import axios from "axios"
import { color } from "../../theme"
import { useDebounce } from "../../common/hooks/useDebounce"
import { useStores } from "../../models"
import { utilSpacing } from "../../theme/Util"

type Address = {
  latitude: number
  longitude: number
  address: string
}
interface ModalAutocompleteProps {
  modalState: ModalStateHandler
  onPressAddress: (address: Address) => void
}

export const ModalAutocomplete = (props: ModalAutocompleteProps) => {
  const { modalState, onPressAddress } = props
  const [search, setSearch] = useState({ term: "", fetchPredictions: false })
  const [isLoading, setIsLoading] = useState(false)
  const [predictions, setPredictions] = useState<PredictionType[]>([])
  const { commonStore, messagesStore } = useStores()

  const GOOGLE_PACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place"

  /**
   * Grab predictions on entering text
   * by sending request to Google Places API.
   * API details: https://developers.google.com/maps/documentation/places/web-service/autocomplete
   */
  const onChangeText = async () => {
    if (search.term.trim() === "") return
    if (!search.fetchPredictions) return
    setIsLoading(true)
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=AIzaSyABdfOq8xWg87ngj4rbG_bHTa5wwEjjUOg&input=${search.term}`
    try {
      const result = await axios.request({
        method: "post",
        url: apiUrl,
      })
      if (result) {
        const {
          data: { predictions },
        } = result
        const formatedPredictions = predictions.map((prediction: any) => {
          return {
            ...prediction,
            placeId: prediction.place_id,
            matchedSubstrings: prediction.matched_substrings,
            tructuredFormatting: {
              mainText: prediction.structured_formatting.main_text,
              mainTextMatchedSubstrings:
                prediction.structured_formatting.main_text_matched_substrings,
              secondaryText: prediction.structured_formatting.secondary_text,
            },
          }
        })
        setPredictions(formatedPredictions)
        setIsLoading(false)
      }
    } catch (e) {
      __DEV__ && console.log(e)
      setIsLoading(false)
      messagesStore.showError()
    }
  }
  useDebounce(onChangeText, 500, [search.term])

  /**
   * Grab lattitude and longitude on prediction tapped
   *    by sending another reqyest using the place id.
   * You can check what kind of information you can get at:
   *    https://developers.google.com/maps/documentation/places/web-service/details#PlaceDetailsRequests
   */
  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=AIzaSyABdfOq8xWg87ngj4rbG_bHTa5wwEjjUOg&place_id=${placeId}`
    commonStore.setVisibleLoading(true)
    try {
      const result = await axios.request({
        method: "post",
        url: apiUrl,
      })
      if (result) {
        const {
          data: {
            result: {
              geometry: { location },
            },
          },
        } = result
        const { lat, lng } = location

        console.log(lat, lng)
        commonStore.setVisibleLoading(false)
        setSearch({ term: "", fetchPredictions: false })
        setPredictions([])
        onPressAddress({ latitude: lat, longitude: lng, address: description })
        modalState.setVisible(false)
      }
    } catch (e) {
      __DEV__ && console.log(e)
      commonStore.setVisibleLoading(false)
      messagesStore.showError()
    }
  }

  return (
    <Modal
      modal={modalState}
      style={styles.modal}
      styleBody={styles.noRadius}
      position="bottom"
      isVisibleIconClose={false}
    >
      <View style={styles.modal}>
        <TouchableOpacity onPress={() => modalState.setVisible(false)}>
          <Icon name="xmark" size={30} color={color.text}></Icon>
        </TouchableOpacity>

        <Text
          size="lg"
          tx="modalAutocomplete.title"
          style={[styles.title, utilSpacing.pb4, utilSpacing.mt4]}
          preset="bold"
        ></Text>

        <SearchBarWithAutocomplete
          value={search.term}
          onChangeText={(text) => {
            setSearch({ term: text, fetchPredictions: true })
          }}
          isLoading={isLoading}
          predictions={predictions}
          onPredictionTapped={onPredictionTapped}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: "100%",
  },
  noRadius: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  title: {
    fontSize: 20,
  },
})
