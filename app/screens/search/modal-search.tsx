import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { BackHandler, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"

import RNUxcam from "react-native-ux-cam"
import { useDebounce } from "../../common/hooks/useDebounce"
import {
  DayDelivery,
  Dish,
  EmptyData,
  Icon,
  Modal,
  ModalRequestDish,
  Separator,
} from "../../components"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import { DishChef } from "../../models/dish-store"
import { color, spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"

interface ModalSearchProps {
  modalState: ModalStateHandler
  onDishPress: (dish: DishChef) => void
}
const modalStateRequestDish = new ModalStateHandler()
export const ModalSearch = observer(({ modalState, onDishPress }: ModalSearchProps) => {
  const { dishStore, dayStore, messagesStore, addressStore } = useStores()
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dishStore.clearSearchDishes()

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setSearch("")
      modalState.setVisible(false)
      return true
    })

    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (search.length === 0) {
      dishStore.clearSearchDishes()
    }
  }, [dishStore.dishesSearch])

  useEffect(() => {
    if (!modalStateRequestDish.isVisible) {
      setSearch("")
      modalState.setVisible(false)
      dishStore.clearSearchDishes()
    }
  }, [modalStateRequestDish.isVisible])

  useEffect(() => {
    if (search?.length > 0) setIsLoading(true)
  }, [search])

  useEffect(() => {
    onSearch()
  }, [dayStore.currentDay.date])

  const onSearch = () => {
    if (search?.length > 0) {
      const { latitude, longitude } = addressStore.current
      setIsLoading(true)
      RNUxcam.logEvent("searchDish", {
        search,
      })
      dishStore
        .getSearch(search, dayStore.currentDay.date, RNLocalize.getTimeZone(), latitude, longitude)
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
      dishStore.clearSearchDishes()
    }
  }

  const onChangeDay = (day: Day) => {
    dayStore.setCurrentDay(day)

    RNUxcam.logEvent("changeDate", {
      screen: "modalSearch",
    })
  }

  useDebounce(onSearch, 500, [search])

  return (
    <>
      <Modal
        state={modalState}
        style={styles.modal}
        styleBody={styles.noRadius}
        position="bottom"
        isVisibleIconClose={false}
      >
        <StatusBar backgroundColor={color.palette.white} barStyle={"dark-content"} />

        <View style={styles.modal}>
          <View style={[utilSpacing.mx5, utilSpacing.mt4]}>
            <TouchableOpacity onPress={() => modalState.setVisible(false)}>
              <Icon name="xmark" size={30} color={color.text}></Icon>
            </TouchableOpacity>

            <TextInput
              style={[styles.inputStyle, utilSpacing.px6, utilSpacing.py4, utilSpacing.my3]}
              placeholder={getI18nText("searchScreen.searchPlaceholder")}
              placeholderTextColor={color.palette.grayDark}
              value={search}
              onChangeText={(value) => setSearch(value)}
              returnKeyType="search"
              autoFocus={true}
            ></TextInput>
            {isLoading && (
              <ProgressBar
                height={2}
                indeterminate
                backgroundColor={color.palette.grayDark}
                trackColor={color.palette.grayLight}
              />
            )}
          </View>

          {search?.length !== 0 && (
            <DayDelivery
              days={dayStore.days}
              onPress={(day) => {
                onChangeDay(day)
              }}
              hideWhyButton={true}
              style={utilSpacing.mt2}
            ></DayDelivery>
          )}

          <ScrollView style={utilSpacing.px4}>
            {dishStore.dishesSearch.map((dish, index) => (
              <View key={dish.id}>
                <Dish dish={dish} onPress={() => onDishPress(dish)}></Dish>
                {index !== dishStore.totalDishes - 1 && (
                  <Separator style={utilSpacing.my3}></Separator>
                )}
              </View>
            ))}

            {search?.length !== 0 && !isLoading && (
              <EmptyData
                lengthData={dishStore.dishesSearch.length}
                onPressRequestDish={() => modalStateRequestDish.setVisible(true)}
              ></EmptyData>
            )}
          </ScrollView>
        </View>
      </Modal>
      <ModalRequestDish modalState={modalStateRequestDish}></ModalRequestDish>
    </>
  )
})

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: spacing[3],
    color: color.text,
  },
  modal: {
    height: "100%",
  },

  noRadius: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 0,
  },
})
