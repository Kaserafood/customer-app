import React from "react"

import { useFormContext } from "react-hook-form"
import { Calendar } from "react-native-calendars"
import { Modal } from "../../components"
import { color } from "../../theme"
import { toFormatDate } from "../../utils/date"
import { ModalState } from "../../utils/modalState"

interface CalendarProps {
  onDayPress: (date: string) => void
  modalState: ModalState
}

const ModalCalendar = ({ onDayPress, modalState }: CalendarProps) => {
  // const { dayStore } = useStores()
  const methods = useFormContext()

  // if (dayStore.days.length === 0) return null

  // if (initialDate.length === 0) {
  //   initialDate = dayStore.days[1].date
  //   __DEV__ && console.log(initialDate)
  // }
  return (
    <Modal state={modalState}>
      <Calendar
        // initialDate={initialDate}
        // minDate={dayStore.days[1]?.date}
        maxDate={toFormatDate(new Date(), "YYYY-MM-DD")}
        onDayPress={(day) => {
          onDayPress(day.dateString)
          modalState.setVisible(false)
          //   methods.setValue(inputName, day.dateString)
        }}
        theme={{
          dayTextColor: color.text,
          todayTextColor: color.primary,
          arrowColor: color.primary,
        }}
        // markedDates={{
        //   [initialDate]: { marked: true, dotColor: color.primary },
        // }}
      />
    </Modal>
  )
}

export default ModalCalendar
