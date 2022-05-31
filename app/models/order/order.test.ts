import { OrderModel } from "./order"

test("can be created", () => {
  const instance = OrderModel.create({})

  expect(instance).toBeTruthy()
})
