import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import RNLocation from "react-native-location"
import LocationEnabler from "react-native-location-enabler"
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps"
import { Button, Header, Icon, InputText, Screen, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageInfo } from "../../utils/messages"

const {
  PRIORITIES: { HIGH_ACCURACY },
  addListener,
  checkSettings,
  requestResolutionSettings,
} = LocationEnabler

interface Location {
  latitude: number
  longitude: number
}

export const MapScreen: FC<StackScreenProps<NavigatorParamList, "map">> = observer(
  ({ navigation }) => {
    const [location, setLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const [currentLocation, setCurrentLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const { ...methods } = useForm({ mode: "onBlur" })
    const [formError, setError] = useState<boolean>(false)

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
          // [checkSettings] or changed using [requestResolutionSettings]
          const listener = addListener(({ locationEnabled }) => {
            console.log(`Location are ${locationEnabled ? "enabled" : "disabled"}`)

            if (locationEnabled) {
              RNLocation.getLatestLocation({ timeout: 60000 }).then((latestLocation) => {
                // Use the location here
                setLocation({
                  latitude: latestLocation.latitude,
                  longitude: latestLocation.longitude,
                })

                setCurrentLocation({
                  latitude: latestLocation.latitude,
                  longitude: latestLocation.longitude,
                })

                console.log("MapScreen: latestLocation", latestLocation)
                listener.remove()
              })
            } else {
              showMessageInfo("mapScreen.disabledLocation")
            }
          })

          // Removes this subscription
          //
        }
      })
    }, [])

    const toAddress = () => {
      navigation.navigate("address")
    }

    const onRegionChange = (region: Region) => {
      // setLocation({ latitude: region.latitude, longitude: region.longitude })
      console.log(`Change region: ${JSON.stringify(region)}`)

      // setCurrentLocation({
      //   latitude: region.latitude,
      //   longitude: region.longitude,
      // })
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
              latitudeDelta: 0.02000022679567337,
              longitudeDelta: 0.025352570447102707,
            }}
            onRegionChange={onRegionChange}
          ></MapView>

          {/* <OverlayComponent style={{ position: "absolute", bottom: 50 }} /> */}
          <View pointerEvents="none" style={styles.containerMarker}>
            <Icon name="location" size={50} color={color.primary}></Icon>
          </View>

          {/* <Button onPress={requestResolution}></Button> */}
        </View>
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
                setFormError={setError}
                rules={{
                  required: "mapScreen.addressRequired",
                }}
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
    justifyContent: "flex-end",
    width: 400,
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
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})
