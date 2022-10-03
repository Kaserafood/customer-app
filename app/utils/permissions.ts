import { check, Permission, request, requestNotifications,checkNotifications, RESULTS } from "react-native-permissions"

export async function checkPermission(permision: Permission): Promise<boolean> {
  return await check(permision)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          __DEV__ && console.log("This feature is not available (on this device / in this context)")
          break
        case RESULTS.DENIED:
          __DEV__ &&
            console.log("The permission has not been requested / is denied but requestable")
          break
        case RESULTS.LIMITED:
          __DEV__ && console.log("The permission is limited: some actions are possible")
          break
        case RESULTS.GRANTED:
          __DEV__ && console.log("The permission is granted")
          return true
        case RESULTS.BLOCKED:
          __DEV__ && console.log("The permission is denied and not requestable anymore")
          break
      }
      return false
    })
    .catch((error) => {
      console.log(`Error request permision :${JSON.stringify(error)}`)
      return false
    })
}

export async function requestPermission(permission: Permission) {
  return await request(permission).then((result) => {
    return result
  })
}

export async function requestNotificationPermission() {
  return await requestNotifications(["alert", "sound"])
    .then(({ status, settings }) => {
      __DEV__ && console.log(status, settings)
      if (status === RESULTS.GRANTED) return true

      return false
    })
    .catch(console.log)
}

export function checkNotificationPermission() {
  checkNotifications().then(({ status }) => {
   
    if (status === RESULTS.DENIED) requestNotificationPermission()
  })
}
