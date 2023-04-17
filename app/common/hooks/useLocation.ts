/* eslint-disable node/no-callback-literal */
// eslint-disable-next-line react-native/split-platform-components
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native"
import Geolocation from "react-native-geolocation-service"

import { Messages } from "../../models"

export interface Location {
  latitude: number
  longitude: number
  longitudeDelta: number
  latitudeDelta: number
  locationAvailable?: boolean
}

export interface Address {
  city: string
  region: string
  formatted: string
  country: string
}

export const useLocation = (messagesStore: Messages) => {
  const fetchAddressText = async (latitude: number, longitude: number): Promise<Address> => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    }

    return await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyABdfOq8xWg87ngj4rbG_bHTa5wwEjjUOg&language=es`,
      requestOptions,
    )
      .then((response) => response.json())
      .then(async (mapResponse) => {
        const results = mapResponse.results
        let index = findIndexByType(results, "locality")
        if (index === -1) index = findIndexByType(results, "plus_code")
        if (index === -1) index = findIndexByType(results, "route")
        if (index === -1) index = 0

        let city = ""
        let region = ""
        let country = ""
        let formatted = ""
        const components = results[index].address_components

        for (let i = 0; i < components.length; i++) {
          if (components[i].types.includes("locality")) city = components[i].long_name

          if (components[i].types.includes("administrative_area_level_1"))
            region = components[i].long_name

          if (components[i].types.includes("country")) country = components[i].long_name
        }

        if (results.length > 0) {
          results.forEach((item) => {
            if (item.types.includes("route")) {
              formatted = item.formatted_address
            }
          })

          if (formatted.length === 0) formatted = results[0].formatted_address
        }

        return {
          city,
          region,
          country,
          formatted,
        }
      })
      .catch((error) => {
        console.log("error", error)

        messagesStore.showError()
        return {
          city: "",
          region: "",
          country: "",
          formatted: "",
        }
      })
  }

  const findIndexByType = (results: any, type: string) => {
    let index = -1
    for (let j = 0; j < results.length; j++) {
      if (results[j].types.includes(type)) {
        index = j
        break
      }
    }
    return index
  }

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        messagesStore.showError("location.canNotOpenSettings", true)
      })
    }
    const status = await Geolocation.requestAuthorization("whenInUse")

    if (status === "granted") return true

    if (status === "denied") messagesStore.showError("location.necessaryAcceptPermission", true)

    if (status === "disabled") {
      Alert.alert(`location.enableServices`, "", [
        { text: "location.goToSettings", onPress: openSetting },
        {
          text: "location.dontUseLocation",
          onPress: () => {
            messagesStore.showError("location.necessaryAcceptPermission", true)
            console.log("Dont use press")
          },
        },
      ])
    }

    return false
  }

  const hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await hasPermissionIOS()
      return hasPermission
    }

    if (Platform.OS === "android" && Platform.Version < 23) return true

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (hasPermission) return true

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true

    if (status === PermissionsAndroid.RESULTS.DENIED)
      messagesStore.showError("location.necessaryAcceptPermission", true)
    else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
      messagesStore.showError("location.necessaryAcceptPermission", true)

    return false
  }

  async function getCurrentPosition(callback: (location: Location) => void) {
    const hasPermission = await hasLocationPermission()

    if (!hasPermission) return

    Geolocation.getCurrentPosition(
      (position) => {
        callback({
          locationAvailable: true,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          latitudeDelta: 0.020000524857270108,
          longitudeDelta: 0.004366971552371979,
        })
      },
      (error) => {
        callback({
          locationAvailable: false,
          longitude: 0,
          latitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        })

        __DEV__ && console.log("error getPosition ->", error.message, error.code)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  return {
    getCurrentPosition,
    fetchAddressText,
  }
}
