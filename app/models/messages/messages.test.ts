import { MessagesModel } from "./messages"

test("can be created", () => {
  const instance = MessagesModel.create({})

  expect(instance).toBeTruthy()
})
