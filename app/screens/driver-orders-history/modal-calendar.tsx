import React from "react"

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
  return (
    <Modal state={modalState}>
      <Calendar
        maxDate={toFormatDate(new Date(), "YYYY-MM-DD")}
        onDayPress={(day) => {
          onDayPress(day.dateString)
          modalState.setVisible(false)
        }}
        theme={{
          dayTextColor: color.text,
          todayTextColor: color.primary,
          arrowColor: color.primary,
        }}
      />
    </Modal>
  )
}

export default ModalCalendar
