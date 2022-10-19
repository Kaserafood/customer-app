import DeviceCountry from "react-native-device-country"

export async function getCountryCode(): Promise<string> {
  return await DeviceCountry.getCountryCode()
    .then((result) => {
      // {"code": "BY", "type": "telephony"}
      __DEV__ && console.log(result)
      return result.code.toUpperCase()
    })
    
    .catch((e) => {
      __DEV__ && console.log(e)
      return ""
    })
}

export function getCurrencyCode(countryCode: string): string {
  // Guatemala
  if (countryCode === "GT") {
    return "GTQ"
  }
  // Mexico
  return "MXN"
}
