/* eslint-disable node/no-callback-literal */
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from "react-native"
import Geolocation from "react-native-geolocation-service"
import { showMessageError } from "../../utils/messages"

export interface Location {
  latitude?: number
  longitude?: number
  longitudeDelta?: number
  latitudeDelta?: number
  locationAvailable?: boolean
}

export interface Address {
  city: string
  region: string
  formatted: string
  country: string
}

export const useLocation = () => {
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
      .then((mapResponse) => {
        const results = mapResponse.results
        let index = 0
        for (let j = 0; j < results.length; j++) {
          if (results[j].types[0] === "locality") {
            index = j
            break
          }
        }
        let city = ""
        let region = ""
        let country = ""
        let formatted = ""

        for (let i = 0; i < results[index].address_components.length; i++) {
          if (results[index].address_components[i].types[0] === "locality") {
            city = results[index].address_components[i].long_name
          }
          if (results[index].address_components[i].types[0] === "administrative_area_level_1") {
            region = results[index].address_components[i].long_name
          }
          if (results[index].address_components[i].types[0] === "country") {
            country = results[index].address_components[i].long_name
          }
        }

        if (results[0]?.formatted_address) {
          formatted = results[0].formatted_address
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

        showMessageError()
        return {
          city: "",
          region: "",
          country: "",
          formatted: "",
        }
      })
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse")
      // IOS permission request does not offer a callback
      return null
    }
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) return true

        return false
      } catch (err) {
        console.warn(err.message)
        return false
      }
    }
    return false
  }

  async function getCurrentPosition(callback: (location: Location) => void) {
    const hasLocationPermission = await requestLocationPermission()
    /* This will only be fired on Android. On Apple we can not detect when/if a
     * location permission has been granted or denied. For that reason after a
     * predefined period we just timeout.
     */

    if (hasLocationPermission === false) {
      callback({
        locationAvailable: false,
      })
      __DEV__ && console.log("Can not obtain location permission")
      return
    }

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
        })

        __DEV__ && console.log(error.message, error.code)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    )
  }

  return {
    getCurrentPosition,
    fetchAddressText,
  }
}
