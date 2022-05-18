import { flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../services/api"

const dayStore = types.model("DayStore").props({
  dayName: types.maybe(types.string),
  date: types.maybe(types.string),
})
export interface Day extends SnapshotOut<typeof dayStore> {}

export const DayStoreModel = types
  .model("DayStoreModel")
  .props({
    days: types.optional(types.array(dayStore), []),
    currentDay: types.optional(dayStore, { dayName: "", date: "" }),
  })
  .actions((self) => ({
    setDays: async (days: Day[]) => {
      self.days.replace(days)
    },
  }))
  .actions((self) => ({
    getDays: flow(function* getDays(timeZone: string) {
      //if (self.days.length > 0) return
      const api = new Api()

      const result = yield api.getDaysDelivery(timeZone)

      if (result && result.kind === "ok") {
        self.setDays(result.data)
      }
    }),
    setCurrentDay: (day: Day) => {
      self.currentDay = { ...day }
    },
  }))
