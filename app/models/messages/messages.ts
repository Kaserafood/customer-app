import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model for global messages
 */
export const MessagesModel = types
  .model("Messages")
  .props({
    text: types.optional(types.string, ""),
    isVisibleSuccess: types.optional(types.boolean, false),
    isVisibleError: types.optional(types.boolean, false),
    isVisibleInfo: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    hideSuccess: () => {
      self.isVisibleSuccess = false
    },
  }))
  .actions((self) => ({
    setVisibleSuccess: (value: boolean) => {
      self.isVisibleSuccess = value

      if (value) {
        setTimeout(() => {
          console.log("hide success")
          self.hideSuccess()
        }, 3000)
      }
    },
    setVisibleError: (value: boolean) => {
      self.isVisibleError = value
    },
    setVisibleInfo: (value: boolean) => {
      self.isVisibleInfo = value
    },
    setText: (value: string) => {
      self.text = value
    },
  }))
  .actions((self) => ({
    showSuccess: (text: string) => {
      self.setText(text)
      self.setVisibleSuccess(true)
    },
  }))

type MessagesType = Instance<typeof MessagesModel>
export interface Messages extends MessagesType {}
type MessagesSnapshotType = SnapshotOut<typeof MessagesModel>
export interface MessagesSnapshot extends MessagesSnapshotType {}
export const createMessagesDefaultModel = () => types.optional(MessagesModel, {})
