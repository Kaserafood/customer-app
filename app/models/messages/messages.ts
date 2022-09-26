import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TxKeyPath } from "../../i18n"
import { getI18nText } from "../../utils/translate"

/**
 * Model for global messages
 */
const timeShow = 4000
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
    hideError: () => {
      self.isVisibleError = false
    },
    hideInfo: () => {
      self.isVisibleInfo = false
    },
  }))
  .actions((self) => ({
    setVisibleSuccess: (value: boolean) => {
      self.isVisibleSuccess = value

      if (value) {
        setTimeout(() => {
          __DEV__ && console.log("hide success")
          self.hideSuccess()
        }, timeShow)
      }
    },
    setVisibleError: (value: boolean) => {
      self.isVisibleError = value
      if (value) {
        setTimeout(() => {
          __DEV__ && console.log("hide error")
          self.hideError()
        }, timeShow)
      }
    },
    setVisibleInfo: (value: boolean) => {
      self.isVisibleInfo = value
      if (value) {
        setTimeout(() => {
          __DEV__ && console.log("hide info")
          self.hideInfo()
        }, timeShow)
      }
    },
    setText: (value: string) => {
      self.text = value
    },
  }))
  .actions((self) => ({
    showSuccess: (text: TxKeyPath | string, isI18n?: boolean) => {
      let msg = ""
      if (isI18n) msg = getI18nText(text as TxKeyPath)
      else msg = text ?? getI18nText("common.operationSuccess")

      self.setText(msg)
      self.setVisibleSuccess(true)
    },
    showError: (text?: TxKeyPath | string, isI18n?: boolean) => {
      let msg = ""
      if (isI18n) msg = getI18nText(text as TxKeyPath)
      else msg = text ?? getI18nText("common.someError")

      self.setText(msg)
      self.setVisibleError(true)
    },
    showInfo: (text: TxKeyPath | string, isI18n?: boolean) => {
      let msg = ""
      if (isI18n) msg = getI18nText(text as TxKeyPath)
      else msg = text ?? getI18nText("common.operationExecuted")

      self.setText(msg)
      self.setVisibleInfo(true)
    },
  }))

type MessagesType = Instance<typeof MessagesModel>
export interface Messages extends MessagesType {}
type MessagesSnapshotType = SnapshotOut<typeof MessagesModel>
export interface MessagesSnapshot extends MessagesSnapshotType {}
export const createMessagesDefaultModel = () => types.optional(MessagesModel, {})
