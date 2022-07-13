import { applySnapshot, flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../services/api"

const dayStore = types.model("DayStore").props({
  dayName: types.maybe(types.string),
  dayNameLong: types.maybe(types.string),
  date: types.maybe(types.string),
  active: types.maybe(types.boolean),
})
export interface Day extends SnapshotOut<typeof dayStore> {}

export const DayStoreModel = types
  .model("DayStoreModel")
  .props({
    days: types.optional(types.array(dayStore), []), // Days array
    daysByChef: types.optional(types.array(dayStore), []), // Days available for a chef
    currentDay: types.optional(dayStore, { dayName: "", date: "" }),
  })
  .actions((self) => ({
    setDays: async (days: Day[]) => {
      self.days.replace(days)
    },
    setDaysByChef: async (days: Day[]) => {
      self.daysByChef.replace(days)
    },
  }))
  .actions((self) => ({
    getDays: flow(function* getDays(timeZone: string) {
      const api = new Api()
      const result = yield api.getDaysDelivery(timeZone)

      if (result && result.kind === "ok") {
        self.setDays(result.data)
      }
    }),
    getDaysByChef: flow(function* getDaysByChef(timeZone: string, chefId: number) {
      const api = new Api()

      const result = yield api.getDaysByChefDelivery(timeZone, chefId)

      if (result && result.kind === "ok") {
        self.setDaysByChef(result.data)
      }
    }),
    setCurrentDay: (day: Day) => {
      applySnapshot(self.currentDay, day)
    },

    setActiveDay(day: Day) {
      self.daysByChef.replace(
        self.daysByChef.map((item) => {
          return {
            ...item,
            active: day.date === item.date,
          }
        }),
      )
    },
  }))
