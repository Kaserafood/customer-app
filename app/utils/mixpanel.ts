import { Mixpanel } from "mixpanel-react-native"

let instance: Mixpanel
const token = __DEV__ ? "7a5f2a03f18052a705ac7244a9412486" : "9b7b48d1b3037c0f42710f666b846033"

export function initializeMixpanel() {
  const trackAutomaticEvents = true
  instance = new Mixpanel(token, trackAutomaticEvents)
  instance.init()
}

export function getInstanceMixpanel() {
  if (!instance) initializeMixpanel()
  return instance
}
