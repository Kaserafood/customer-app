import * as RNLocalize from "react-native-localize"

import { useStores } from "../../models"
import { Day } from "../../models/day-store"

export const useDay = () => {
  const { dishStore, commonStore, dayStore, userStore } = useStores()

  const onChangeDay = async (day: Day) => {
    commonStore.setVisibleLoading(true)
    dayStore.setCurrentDay(day)
    await dishStore.getAll(day.date, RNLocalize.getTimeZone(), userStore.userId).finally(() => {
      commonStore.setVisibleLoading(false)
    })
  }
  return {
    onChangeDay,
  }
}
