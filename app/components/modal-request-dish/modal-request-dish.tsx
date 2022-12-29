import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Keyboard, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"
import Ripple from "react-native-material-ripple"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { toFormatDate } from "../../utils/date"
import { ModalStateHandler } from "../../utils/modalState"
import { Button } from "../button/button"
import { Card } from "../card/card"
import { Image } from "../image/image"
import { InputText } from "../input-text/input-text"
import { Modal } from "../modal/modal"
import { Text } from "../text/text"

import { useModalRequest } from "./useModalRequest"

const modalStateCalendar = new ModalStateHandler()
const modalStateConfirmation = new ModalStateHandler()

export interface ModalRequestDishProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Modal state to handle if is visible
   */

  modalState: ModalStateHandler
}

/**
 * Modal to request a dish when it is not found
 */
export const ModalRequestDish = observer(function ModalRequestDish(props: ModalRequestDishProps) {
  const { style, modalState } = props

  const { ...methods } = useForm({ mode: "onBlur" })
  const [selectedDate, setSelectedDate] = useState("")
  const [isActiveWithoutDate, setIsActiveWithoutDate] = useState(true)
  const { calendarText } = useModalRequest()
  const { dishStore, userStore, commonStore, messagesStore } = useStores()

  useEffect(() => {
    if (!modalStateCalendar.isVisible) {
      if (selectedDate.length === 0) changeActiveDate(true)
    }
  }, [modalStateCalendar.isVisible, selectedDate])

  const onError = (error: any) => {
    __DEV__ && console.log(error)
  }

  const onSubmit = (data: any) => {
    commonStore.setVisibleLoading(true)
    dishStore
      .request(data.dishName, data.peopleCount, selectedDate, userStore.email, userStore.userId)
      .then((response) => {
        if (response.data > 0) {
          modalStateConfirmation.setVisible(true)
          modalState.setVisible(false)
          setSelectedDate("")
          methods.resetField("dishName")
          methods.resetField("peopleCount")
        }
      })
      .catch((error: Error) => {
        messagesStore.showError(error.message)
      })
      .finally(() => {
        commonStore.setVisibleLoading(false)
      })
  }

  const changeActiveDate = (activeWithoutDate: boolean) => {
    Keyboard.dismiss()
    setIsActiveWithoutDate(activeWithoutDate)

    if (!activeWithoutDate) {
      modalStateCalendar.setVisible(true)
    } else setSelectedDate("")
  }

  const onDayPress = (date: string) => {
    setSelectedDate(date)
    modalStateCalendar.setVisible(false)
  }

  LocaleConfig.locales.es = calendarText
  LocaleConfig.defaultLocale = "es"

  return (
    <>
      <Modal modal={modalState} style={style} position="center">
        <View>
          <View style={utilSpacing.mx4}>
            <Text
              preset="bold"
              size="lg"
              style={[utilSpacing.mt4, utilSpacing.mb2]}
              tx="modalRequestDish.tellUsWhatYouNeed"
            ></Text>
            <Text
              caption
              preset="semiBold"
              style={utilSpacing.mb5}
              tx="modalRequestDish.weSarchBetter"
            ></Text>
          </View>

          <FormProvider {...methods}>
            <InputText
              preset="card"
              name="dishName"
              labelTx="modalRequestDish.dishName"
              placeholderTx="modalRequestDish.dishNamePlaceholder"
              rules={{
                required: "modalRequestDish.dishNameRequired",
              }}
              maxLength={200}
            ></InputText>
            <InputText
              preset="card"
              name="peopleCount"
              labelTx="modalRequestDish.peopleCount"
              placeholderTx="modalRequestDish.writeHere"
              keyboardType="numeric"
              maxLength={3}
            ></InputText>
            <View style={utilSpacing.mx4}>
              <Text preset="bold" style={utilSpacing.my5} tx="modalRequestDish.whenYouNeed"></Text>
              <View style={utilFlex.flexRow}>
                <Ripple
                  onPressIn={() => changeActiveDate(true)}
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  style={[utilSpacing.mr2, utilFlex.flex1]}
                >
                  <Card
                    style={[
                      styles.dateCard,
                      utilSpacing.px4,
                      utilFlex.flexCenter,
                      isActiveWithoutDate && styles.cardActive,
                    ]}
                  >
                    <Text tx="modalRequestDish.dateNotSpecific"></Text>
                  </Card>
                </Ripple>
                <Ripple
                  onPress={() => changeActiveDate(false)}
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  style={[utilSpacing.ml2, utilFlex.flex1]}
                >
                  <Card
                    style={[
                      styles.dateCard,
                      utilSpacing.px4,
                      utilFlex.flexCenter,
                      !isActiveWithoutDate && styles.cardActive,
                    ]}
                  >
                    {selectedDate.length === 0 ? (
                      <Text tx="modalRequestDish.selectDate"></Text>
                    ) : (
                      <View>
                        <Text
                          text={toFormatDate(new Date(`${selectedDate}T00:00:00`), "DD/MM/YYYY")}
                          style={utilSpacing.mb1}
                        ></Text>
                      </View>
                    )}
                  </Card>
                </Ripple>
              </View>
            </View>

            <Button
              tx="modalRequestDish.request"
              style={[styles.btn, utilFlex.selfCenter, utilSpacing.my8, utilSpacing.mb5]}
              onPress={methods.handleSubmit(onSubmit, onError)}
            ></Button>
          </FormProvider>
        </View>
      </Modal>
      <CalendarPicker
        onDayPress={(date) => onDayPress(date)}
        initialDate={selectedDate}
      ></CalendarPicker>
      <ModalConfirmation></ModalConfirmation>
    </>
  )
})

const CalendarPicker = (props: { onDayPress: (date: string) => void; initialDate: string }) => {
  let { initialDate } = props
  const { dayStore } = useStores()

  if (dayStore.days.length === 0) return null

  if (initialDate.length === 0) {
    initialDate = dayStore.days[1].date
    __DEV__ && console.log(initialDate)
  }
  return (
    <Modal modal={modalStateCalendar}>
      <Calendar
        initialDate={initialDate}
        minDate={dayStore.days[1]?.date}
        onDayPress={(day) => {
          props.onDayPress(day.dateString)
        }}
        theme={{
          textColor: color.text,
          todayTextColor: color.primary,
          arrowColor: color.primary,
        }}
        markedDates={{
          [initialDate]: { marked: true, dotColor: color.primary },
        }}
      />
    </Modal>
  )
}

const ModalConfirmation = () => {
  return (
    <Modal modal={modalStateConfirmation}>
      <View style={utilSpacing.p4}>
        <Text
          size="lg"
          preset="semiBold"
          tx="modalRequestDish.ready"
          style={utilSpacing.mb5}
        ></Text>
        <Text
          preset="semiBold"
          tx="modalRequestDish.confirmationInfo"
          style={utilSpacing.mb5}
        ></Text>

        <Image
          resizeMode="contain"
          style={[styles.imgNotFound, utilSpacing.mb5, utilSpacing.ml2]}
          source={images.soup}
        ></Image>
        <Button
          tx="modalRequestDish.continue"
          style={styles.btnContinue}
          onPress={() => modalStateConfirmation.setVisible(false)}
        ></Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: "90%",
  },
  btnContinue: {
    alignSelf: "center",
    minWidth: "75%",
  },
  cardActive: {
    borderColor: color.primary,
    borderWidth: 2,
  },
  dateCard: {
    height: 80,
  },
  imgNotFound: {
    alignSelf: "center",
    height: 200,
    left: 15,
    position: "relative",
    width: "100%",
  },
})
