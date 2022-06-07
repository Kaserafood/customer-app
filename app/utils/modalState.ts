import { makeAutoObservable } from "mobx"

export interface ModalState {
  isVisible: boolean
  setVisible: (state: boolean) => void
}
export class ModalStateHandler {
  isVisible = false

  setVisible(state: boolean) {
    this.isVisible = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
