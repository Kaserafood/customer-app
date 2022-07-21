import { useState } from "react"
import { Platform } from "react-native"
//import LocationEnabler from "react-native-location-enabler"
import { Permission, PERMISSIONS } from "react-native-permissions"
import { showMessageError } from "../../utils/messages"

interface Location {
  latitude: number
  longitude: number
  longitudeDelta: number
  latitudeDelta: number
}

interface Address {
  city: string
  region: string
  formatted: string
  country: string
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
    return { latitude: 0, longitude: 0, longitudeDelta: 0, latitudeDelta: 0 }
  }

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

  return {
    setLocation,
    fetchAddressText,
  }
}
