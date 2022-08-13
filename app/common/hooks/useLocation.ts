/* eslint-disable node/no-callback-literal */
// eslint-disable-next-line react-native/split-platform-components
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native"
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

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        showMessageError("location.canNotOpenSettings", true)
      })
    }
    const status = await Geolocation.requestAuthorization("whenInUse")

    if (status === "granted") return true

    if (status === "denied") showMessageError("location.necessaryAcceptPermission")

    if (status === "disabled") {
      Alert.alert(`location.enableServices`, "", [
        { text: "location.goToSettings", onPress: openSetting },
        {
          text: "location.dontUseLocation",
          onPress: () => {
            showMessageError("location.necessaryAcceptPermission")
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
      showMessageError("location.necessaryAcceptPermission")
    else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
      showMessageError("location.necessaryAcceptPermission")

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
