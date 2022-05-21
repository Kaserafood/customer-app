import { useState } from "react"
import { Platform } from "react-native"
import RNLocation from "react-native-location"
import LocationEnabler from "react-native-location-enabler"
import { Permission, PERMISSIONS } from "react-native-permissions"
import { showMessageError, showMessageInfo } from "../../utils/messages"
import { requestPermission } from "../../utils/permissions"
import { getI18nText } from "../../utils/translate"
const {
  PRIORITIES: { HIGH_ACCURACY },
  addListener,
  checkSettings,
  requestResolutionSettings,
} = LocationEnabler

interface Location {
  latitude: number
  longitude: number
  longitudeDelta: number
  latitudeDelta: number
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
    longitudeDelta: 0,
    latitudeDelta: 0,
  })

  const permission = async (): Promise<Location> => {
    let permission: Permission
    if (Platform.OS === "android") permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    else permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    return await requestPermission(permission).then(async (granted) => {
      if (granted) {
        console.log("MapScreen: granted")

        const config = {
          priority: HIGH_ACCURACY,
          alwaysShow: true,
          needBle: false,
        }

        // Check if location is enabled or not
        checkSettings(config)

        // If location is disabled, prompt the user to turn on device location
        requestResolutionSettings(config)

        // Adds a listener to be invoked when location settings checked using
        return await addListenerLocation()
      } else {
        showMessageInfo(getI18nText("mapScreen.disabledLocation"))
        console.log(`MapScreen: denied, ${granted}`)
        return {
          latitude: 0,
          longitude: 0,
          longitudeDelta: 0,
          latitudeDelta: 0,
        }
      }
    })
  }
  const addListenerLocation = async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      const listener = addListener(({ locationEnabled }) => {
        console.log(`Location are ${locationEnabled ? "enabled" : "disabled"}`)

        if (locationEnabled) {
          RNLocation.getLatestLocation({ timeout: 60000 })
            .then((latestLocation) => {
              const location: Location = {
                latitude: latestLocation.latitude,
                longitude: latestLocation.longitude,
                latitudeDelta: 0.020000524857270108,
                longitudeDelta: 0.004366971552371979,
              }
              setLocation({ ...location })

              console.log("MapScreen: latestLocation", latestLocation)
              listener.remove()
              resolve(location)
            })
            .catch(() => {
              resolve({
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
              })
              showMessageInfo(getI18nText("mapScreen.errorToGetLocation"))
            })
        } else {
          resolve({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0,
            longitudeDelta: 0,
          })
          showMessageInfo(getI18nText("mapScreen.disabledLocation"))
        }
      })
    })
  }

  const fetchAddressText = async (latitude: number, longitude: number): Promise<string> => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    }

    return await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyABdfOq8xWg87ngj4rbG_bHTa5wwEjjUOg`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.results[0]?.formatted_address) {
          return result.results[0].formatted_address
        }
        console.log(result.results[0].formatted_address)
        // return ""
      })
      .catch((error) => {
        console.log("error", error)
        console.log("Coordinates:", latitude, longitude)
        showMessageError()
        return ""
      })
  }

  return {
    location,
    permission,
    setLocation,
    fetchAddressText,
  }
}
