import { applySnapshot, flow, SnapshotOut, types } from "mobx-state-tree"

import { Api } from "../services/api"

const { string, maybeNull, boolean } = types

const dayStore = types.model("DayStore").props({
  dayName: types.maybe(types.string),
  dayNameLong: types.maybe(types.string),
  date: types.maybe(string),
  active: types.maybe(types.boolean),
})

const deliveryTime = types.model("DeliveryTime").props({
  start: string,
  end: string,
  value: maybeNull(boolean),
})

export interface Day extends SnapshotOut<typeof dayStore> {}

export interface DeliveryTime extends SnapshotOut<typeof deliveryTime> {}

export const DayStoreModel = types
  .model("DayStoreModel")
  .props({
    days: types.optional(types.array(dayStore), []), // Days array
    daysByChef: types.optional(types.array(dayStore), []), // Days available for a chef
    currentDay: types.optional(dayStore, { dayName: "", date: "" }),
    deliveryTime: types.optional(types.array(deliveryTime), []),
  })
  .views((self) => ({
    get existsDaysByChef() {
      return self.daysByChef.length > 0
    },
  }))
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
      if (chefId === 0) return
      const api = new Api()
      self.daysByChef.clear()
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
    getDeliveryTime: flow(function* (chefId: number) {
      if (chefId === 0) return
      const api = new Api()
      const result = yield api.getDeliveryTime(chefId, self.currentDay.date)

      if (result && result.kind === "ok") {
        applySnapshot(self.deliveryTime, result.data)
      }
    }),
    changeValueDeliveryTime: (value: boolean, index: number) => {
      // Set all values to false
      self.deliveryTime.forEach((item) => {
        item.value = false
      })

      self.deliveryTime[index].value = value
    },
  }))
