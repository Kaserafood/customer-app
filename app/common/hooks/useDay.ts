import { useState } from "react"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import * as RNLocalize from "react-native-localize"

export const useDay = () => {
  const { dishStore, modalStore } = useStores()
  const [currentDate, setCurrentDate] = useState<Day>({ dayName: "", date: "" })
  const onChangeDay = async (day: Day) => {
    modalStore.setVisibleLoading(true)
    setCurrentDate(day)
    await dishStore.getAll(day.date, RNLocalize.getTimeZone())
    modalStore.setVisibleLoading(false)

    //    validLenghDishes()
  }

  return {
    currentDate,
    setCurrentDate,
    onChangeDay,
  }
}
