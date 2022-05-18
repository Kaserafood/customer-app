import { LocationModel } from "./location"

test("can be created", () => {
  const instance = LocationModel.create({})

  expect(instance).toBeTruthy()
})
