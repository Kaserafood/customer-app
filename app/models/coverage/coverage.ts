import { flow, SnapshotOut, types } from "mobx-state-tree"
import { Api } from "../../services/api"

const Coordinate = types.model("Coordinate", {
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number),
})

/**
 * Modelo para las coordenadas de covertura.
 */
export const CoverageModel = types
  .model("Coverage")
  .props({
    // coordinates: types.optional(types.array(Coordinate), []),
    //  holes: types.optional(types.array(types.array(Coordinate)), []),
    coverage: types.maybeNull(types.string),
  })
  .views((self) => ({
    // get getLength() {
    //   return self.coordinates.length + self.holes.length
    // },
    // get getCoordinates() {
    //   return JSON.parse(JSON.stringify(self.coordinates))
    // },
    // get getHoles() {
    //   return JSON.parse(JSON.stringify(self.holes))
    // },
  }))

  .actions((self) => ({
    // getAll: flow(function* getAll() {
    //   const api = new Api()
    //   const result = yield api.getCoverage()
    //   if (result && result.kind === "ok") {
    //     self.coordinates = result.data
    //       .filter((group) => group.type === "FILLING")
    //       .map((group) => group.coordinates)[0]

    //     self.holes = result.data
    //       .filter((group) => group.type === "HOLE")
    //       .map((group) => group.coordinates)
    //   }
    // }),

    getCoverage: flow(function* () {
      const api = new Api()
      const result = yield api.getParam("_coverage")

      if (result && result.kind === "ok") {
        self.coverage = result.data?.value
      }
    }),
  }))
export interface Coverage extends SnapshotOut<typeof CoverageModel> {}
