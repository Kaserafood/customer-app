import { AddressModel } from "./address"

test("can be created", () => {
  const instance = AddressModel.create({})

  expect(instance).toBeTruthy()
})
