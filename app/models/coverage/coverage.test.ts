import { CoverageModel } from "./coverage"

test("can be created", () => {
  const instance = CoverageModel.create({})

  expect(instance).toBeTruthy()
})
