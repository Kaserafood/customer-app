import { useState } from "react"
import { useStores } from "../../models"
import { Day } from "../../models/day-store"
import * as RNLocalize from "react-native-localize"

export const useDay = () => {
  const { dishStore, modalStore, dayStore } = useStores()

  const onChangeDay = async (day: Day) => {
    modalStore.setVisibleLoading(true)
    dayStore.setCurrentDay(day)
    await dishStore.getAll(day.date, RNLocalize.getTimeZone()).finally(() => {
      modalStore.setVisibleLoading(false)
    })
  }
  return {
    onChangeDay,
  }
}
