import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import RNLocation from "react-native-location"
import LocationEnabler from "react-native-location-enabler"
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps"
import { Button, Header, Icon, InputText, Screen, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError, showMessageInfo } from "../../utils/messages"

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

class LoadingState {
  loading = false

  setLoading(state: boolean) {
    this.loading = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const loadingState = new LoadingState()

export const MapScreen: FC<StackScreenProps<NavigatorParamList, "map">> = observer(
  ({ navigation }) => {
    const [location, setLocation] = useState<Location>({
      latitude: 0,
      longitude: 0,
      longitudeDelta: 0,
      latitudeDelta: 0,
    })
    const [address, setAddress] = useState("")

    const { ...methods } = useForm({ mode: "onBlur" })
    let timeOut: NodeJS.Timeout

    useEffect(() => {
      console.log("MapScreen: useEffect")

      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
        },
      }).then((granted) => {
        if (granted) {
          console.log("MapScreen: granted")

          // Define configuration
          const config = {
            priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
            alwaysShow: true, // default false
            needBle: false, // default false
          }

          // Check if location is enabled or not
          checkSettings(config)

          // If location is disabled, prompt the user to turn on device location
          requestResolutionSettings(config)

          // Adds a listener to be invoked when location settings checked using
          addListenerLocation()
        }
      })
    }, [])

    const addListenerLocation = () => {
      const listener = addListener(({ locationEnabled }) => {
        console.log(`Location are ${locationEnabled ? "enabled" : "disabled"}`)

        if (locationEnabled) {
          RNLocation.getLatestLocation({ timeout: 60000 }).then((latestLocation) => {
            setLocation({
              latitude: latestLocation.latitude,
              longitude: latestLocation.longitude,
              // latitude: 14.6026246,
              // longitude: -90.5447617,
              latitudeDelta: 0.020000524857270108,
              longitudeDelta: 0.004366971552371979,
            })

            console.log("MapScreen: latestLocation", latestLocation)
            listener.remove()
          })
        } else {
          showMessageInfo("mapScreen.disabledLocation")
        }
      })
    }

    const toAddress = () => {
      if (location.latitude !== 0 || location.longitude !== 0) {
        navigation.navigate("address", {
          latitude: location.latitude,
          longitude: location.longitude,
          addressMap: address,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
        })
      } else {
        showMessageError("mapScreen.noLocation")
      }
    }

    const onRegionChange = (region: Region) => {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {
        if (location.latitude !== region.latitude && location.longitude !== region.longitude) {
          console.log(`Change region2: ${JSON.stringify(region)}`)

          setLocation({ ...region })
          fetchAddressText(region.latitude, region.longitude)
        }
      }, 1500)
    }

    const fetchAddressText = (latitude: number, longitude: number) => {
      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      }
      loadingState.setLoading(true)
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyABdfOq8xWg87ngj4rbG_bHTa5wwEjjUOg`,
        requestOptions,
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.results[0]?.formatted_address) {
            setAddress(result.results[0].formatted_address)
          }
          console.log(result.results[0].formatted_address)
        })
        .catch((error) => {
          console.log("error", error)
          showMessageError("common.someError")
        })
        .finally(() => loadingState.setLoading(false))
    }

    return (
      <Screen preset="scroll">
        <Header leftIcon="back" headerTx="mapScreen.title" onLeftPress={goBack}></Header>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: location.latitudeDelta,
              longitudeDelta: location.longitudeDelta,
            }}
            onRegionChange={onRegionChange}
          ></MapView>

          <View pointerEvents="none" style={styles.containerMarker}>
            <Icon name="location" size={50} color={color.primary}></Icon>
          </View>
        </View>
        {loadingState.loading ? (
          <ProgressBar height={7} indeterminate backgroundColor={color.primary} />
        ) : (
          <View style={styles.heightProgress}></View>
        )}

        <View style={styles.containerBottom}>
          <View>
            <Text
              tx="mapScreen.whereReciveFood"
              preset="bold"
              size="lg"
              style={utilSpacing.my4}
            ></Text>

            <FormProvider {...methods}>
              <InputText
                name="address"
                placeholderTx="mapScreen.addressPlaceholder"
                styleContainer={utilSpacing.mb6}
                style={styles.textAddrres}
                value={address}
                numberOfLines={3}
                multiline
                editable={false}
              ></InputText>
            </FormProvider>
          </View>

          <Button
            onPressIn={toAddress}
            block
            preset="primary"
            style={[utilFlex.selfCenter, utilSpacing.mb4]}
            tx="common.next"
          ></Button>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "60%",
    justifyContent: "center",
    width: "100%",
  },
  containerBottom: {
    alignSelf: "center",
    flex: 1,
    justifyContent: "space-between",
    minWidth: 300,
    width: "80%",
  },
  containerMarker: {
    alignItems: "center",
    bottom: 50,
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  heightProgress: {
    height: 7,
  },
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  textAddrres: {
    textAlignVertical: "top",
  },
})
