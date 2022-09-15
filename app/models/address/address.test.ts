import { AddressModelStore } from "./address"

test("can be created", () => {
  const instance = AddressModelStore.create({})

  expect(instance).toBeTruthy()
})
