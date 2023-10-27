import React, { useEffect, useState } from "react"

import { observer } from "mobx-react-lite"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Modal, Text } from "../../components"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { toFormatDate } from "../../utils/date"
import { ModalState } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"

interface Props {
  modalState: ModalState
  selectedDate: string
  modalStateCalendar: ModalState
  onFilter: (startDate: string, endDate: string, typeOrder: string[]) => void
}

const ModalFilters = observer(
  ({ modalState, selectedDate, modalStateCalendar, onFilter }: Props) => {
    const method = useForm()

    const [selectedVacuumPacked, setSelectedVacuumPacked] = useState(false)
    const [selectedDailyDelivery, setSelectedDailyDelivery] = useState(false)
    const [currentInput, setCurrentInput] = useState("")

    const getLastWeekDates = () => {
      const date = new Date()
      const lastSunday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() - 7,
      )
      const lastSaturday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() - 1,
      )

      return {
        startDate: lastSunday.toISOString().slice(0, 10),
        endDate: lastSaturday.toISOString().slice(0, 10),
      }
    }
    const [startDate, setStartDate] = useState({
      date: getLastWeekDates().startDate,
      displayDate: toFormatDate(new Date(`${getLastWeekDates().startDate}T00:00:00`), "DD/MM/YYYY"),
    })

    const [endDate, setEndDate] = useState({
      date: getLastWeekDates().endDate,
      displayDate: toFormatDate(new Date(`${getLastWeekDates().endDate}T00:00:00`), "DD/MM/YYYY"),
    })

    useEffect(() => {
      if (selectedDate) {
        console.log("selectedDate", selectedDate)
        if (currentInput === "startDate")
          setStartDate({
            date: selectedDate,
            displayDate: toFormatDate(new Date(`${selectedDate}T00:00:00`), "DD/MM/YYYY"),
          })
        else if (currentInput === "endDate")
          setEndDate({
            date: selectedDate,
            displayDate: toFormatDate(new Date(`${selectedDate}T00:00:00`), "DD/MM/YYYY"),
          })
      }
    }, [selectedDate])

    const handleFilter = () => {
      const typeOrder = []

      if (selectedVacuumPacked) typeOrder.push("VACUUM_PACKED")
      if (selectedDailyDelivery) typeOrder.push("DAILY_DELIVERY")

      onFilter(startDate.date, endDate.date, typeOrder)
    }

    return (
      <Modal state={modalState} position="bottom">
        <View style={utilSpacing.p3}>
          <Text tx="chefInvoiceScreen.filters" preset="bold" size="lg"></Text>

          <Text
            tx="chefInvoiceScreen.typeOrder"
            preset="bold"
            size="md"
            style={[utilSpacing.mt4, utilSpacing.mb3]}
          ></Text>
          <View style={utilFlex.flexRow}>
            <ItemChip
              title={getI18nText("chefInvoiceScreen.vacuumPacked")}
              active={selectedVacuumPacked}
              onPress={() => setSelectedVacuumPacked(!selectedVacuumPacked)}
            ></ItemChip>
            <View style={utilSpacing.ml3}>
              <ItemChip
                title={getI18nText("chefInvoiceScreen.dailyDelivery")}
                active={selectedDailyDelivery}
                onPress={() => setSelectedDailyDelivery(!selectedDailyDelivery)}
              ></ItemChip>
            </View>
          </View>

          <Text
            tx="chefInvoiceScreen.dateRange"
            preset="bold"
            size="md"
            style={[utilSpacing.mt5, utilSpacing.mb3]}
          ></Text>
          <FormProvider {...method}>
            <View style={[utilFlex.flexRow, utilSpacing.mr3]}>
              <View style={utilFlex.flex1}>
                <Text tx="chefInvoiceScreen.startDate" style={utilSpacing.mb3}></Text>
                <TouchableOpacity
                  style={styles.date}
                  onPressIn={() => {
                    setCurrentInput("startDate")
                    modalStateCalendar.setVisible(true)
                  }}
                >
                  <Text text={startDate.displayDate}></Text>
                </TouchableOpacity>
              </View>

              <View style={[utilFlex.flex1, utilSpacing.ml3]}>
                <Text tx="chefInvoiceScreen.endDate" style={utilSpacing.mb3}></Text>
                <TouchableOpacity
                  style={styles.date}
                  onPressIn={() => {
                    setCurrentInput("endDate")
                    modalStateCalendar.setVisible(true)
                  }}
                >
                  <Text text={endDate.displayDate}></Text>
                </TouchableOpacity>
              </View>
            </View>
          </FormProvider>

          <Button
            tx="common.search"
            style={[utilSpacing.mb4, utilSpacing.mt5, utilFlex.selfCenter]}
            onPress={handleFilter}
          ></Button>
        </View>
      </Modal>
    )
  },
)

interface ChipProps {
  title: string
  active: boolean
  onPress: () => void
}

const ItemChip = ({ title, active, onPress }: ChipProps) => {
  return (
    <View style={styles.containerChip}>
      <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
        <Text style={active && utilText.textWhite} text={title}></Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: color.palette.gray300,
    borderColor: color.palette.gray300,

    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  chipActive: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  containerChip: {
    borderRadius: 20,
    overflow: "hidden",
    ...SHADOW,
  },
  date: {
    backgroundColor: color.palette.grayLight,

    borderRadius: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
})

export default ModalFilters
