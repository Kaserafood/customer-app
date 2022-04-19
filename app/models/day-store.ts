import { Instance, types, SnapshotOut } from "mobx-state-tree"
import { withEnvironment } from "./extensions/with-environment"
import { DeliveryApi } from "../services/api/delivery-api"
import { handleDataResponseAPI } from "../utils/messages"

const dayStore = types.model("DayStore").props({
  dayName: types.maybe(types.string),
  date: types.maybe(types.string),
})
export interface Day extends SnapshotOut<typeof dayStore> {}

export const DayStoreModel = types
  .model("DayStoreModel")
  .props({
    days: types.optional(types.array(dayStore), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    setDays: async (days: Day[]) => {
      self.days.replace(days)
    },
  }))
  .actions((self) => ({
    getDays: async (timeZone: string) => {
      const api = new DeliveryApi(self.environment.api)

      const result = await api.getDays(timeZone)

      if (result.kind === "ok") {
        self.setDays(result.data)
      } else {
        handleDataResponseAPI(result)
        __DEV__ && console.tron.log("Error : " + result)
        return null
      }
    },
  }))
