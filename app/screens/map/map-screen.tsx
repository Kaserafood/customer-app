import React, { FC, useEffect, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { TouchableOpacity } from "react-native-gesture-handler"
import MapView, { Region } from "react-native-maps"
import Ripple from "react-native-material-ripple"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"

import { Address, Location, useLocation } from "../../common/hooks/useLocation"
import { Button, Header, Icon, Screen, Text } from "../../components"
import { ModalAutocomplete } from "../../components/search-bar-autocomplete/modal-autocomplete"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"
class LoadingState {
  loading = true

  setLoading(state: boolean) {
    this.loading = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const loadingState = new LoadingState()
const modalAddressState = new ModalStateHandler()

export const MapScreen: FC<StackScreenProps<NavigatorParamList, "map">> = observer(
  ({ navigation, route: { params } }) => {
    const { messagesStore } = useStores()
    const { fetchAddressText, getCurrentPosition } = useLocation(messagesStore)
    const mapRef = useRef<MapView>(null)

    const [address, setAddress] = useState<Address>({
      city: "",
      country: "",
      formatted: getI18nText("mapScreen.addressPlaceholder"),
      region: "",
    })
    const [location, setLocation] = useState<Location>({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })

    const [initLocation, setInitLocation] = useState<Location>({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })

    useEffect(() => {
      loadingState.setLoading(true)
      // Request permision to access the location and then enable the location from the device
      getCurrentPosition((location) => {
        if (location.locationAvailable) {
          setInitLocation(location)
          setLocation(location)
          fetchAddressText(location.latitude, location.longitude)
            .then((address) => {
              address && setAddress(address)
            })
            .catch((error: Error) => {
              messagesStore.showError(error.message)
            })
            .finally(() => loadingState.setLoading(false))
        } else {
          loadingState.setLoading(false)
          messagesStore.showError("mapScreen.canNotGetLocation", true)
        }
      })
    }, [])

    const toAddress = () => {
      if ((location.latitude !== 0 || location.longitude !== 0) && address.formatted !== "") {
        navigation.navigate("address", {
          latitude: location.latitude,
          longitude: location.longitude,
          addressMap: address.formatted,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
          country: address.country,
          city: address.city,
          region: address.region,
          screenToReturn: params.screenToReturn,
        })
      } else {
        messagesStore.showError("mapScreen.noLocation", true)
      }
    }

    const onRegionChangeComplete = (region: Region) => {
      if (location.latitude !== region.latitude && location.longitude !== region.longitude) {
        loadingState.setLoading(true)
        __DEV__ && console.log(`Change region2: ${JSON.stringify(region)}`)
        setLocation({ ...region })
        fetchAddressText(region.latitude, region.longitude)
          .then((address) => {
            if (address) {
              setAddress(address)
            }
          })
          .catch((error: Error) => {
            messagesStore.showError(error.message)
          })
          .finally(() => loadingState.setLoading(false))
      }
    }
    const onPressAddress = ({ latitude, longitude, address }) => {
      setLocation({ ...location, latitude, longitude })
      setAddress(address)
      mapRef.current.animateToRegion({ ...location, latitude, longitude })
    }

    const onCurrentLocation = () => {
      mapRef.current.animateToRegion({ ...initLocation })
    }
    return (
      <Screen
        preset="scroll"
        statusBarBackgroundColor={modalAddressState.isVisible ? color.palette.white : color.primary}
        statusBar={modalAddressState.isVisible ? "dark-content" : "light-content"}
      >
        <Header leftIcon="back" headerTx="mapScreen.title" onLeftPress={goBack}></Header>
        <View style={utilFlex.flex1}>
          <View style={styles.container}>
            {initLocation.latitude !== 0 && initLocation.longitude !== 0 && (
              <MapView
                ref={mapRef}
                provider={null}
                style={styles.map}
                initialRegion={initLocation}
                onRegionChangeComplete={onRegionChangeComplete}
              />
            )}

            <View pointerEvents="none" style={styles.containerMarker}>
              <IconRN name="place" size={50} color={color.primary}></IconRN>
            </View>

            {initLocation.latitude !== 0 && initLocation.longitude !== 0 && (
              <View style={styles.containerCurrentLocation}>
                <Ripple
                  rippleOpacity={0.2}
                  rippleDuration={400}
                  onPress={onCurrentLocation}
                  style={[styles.buttonLocation, utilFlex.flexCenter]}
                >
                  <Icon name="location-crosshairs" size={33} color={color.text}></Icon>
                </Ripple>
              </View>
            )}

            <View style={[styles.containerSearch, utilSpacing.mt5]}>
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                rippleContainerBorderRadius={150}
                style={[
                  styles.search,
                  utilSpacing.py5,
                  utilSpacing.px4,
                  utilFlex.flexRow,

                  utilFlex.flexCenterVertical,
                  SHADOW,
                ]}
                onPress={() => modalAddressState.setVisible(true)}
              >
                <Icon name="magnifying-glass" color={color.palette.grayDark} size={18}></Icon>
                <Text tx="mapScreen.searchPlaceholder" style={utilSpacing.ml3}></Text>
              </Ripple>
            </View>
          </View>
          {loadingState.loading ? (
            <ProgressBar
              height={5}
              indeterminate
              backgroundColor={color.primary}
              trackColor={color.palette.grayLigth}
            />
          ) : (
            <View style={styles.heightProgress}></View>
          )}

          <View style={styles.containerBottom}>
            <View style={utilSpacing.mb4}>
              <Text text={address.formatted} preset="bold" size="lg" style={utilSpacing.mt4}></Text>
            </View>

            <Button
              onPressIn={toAddress}
              block
              preset="primary"
              style={[utilFlex.selfCenter, utilSpacing.mb5]}
              tx="mapScreen.cofirmUbication"
              disabled={loadingState.loading}
            ></Button>
          </View>
        </View>

        <ModalAutocomplete
          modalState={modalAddressState}
          onPressAddress={onPressAddress}
        ></ModalAutocomplete>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  buttonLocation: {
    backgroundColor: color.palette.white,
    borderRadius: 150,
    height: 55,
    width: 55,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  containerAddress: {
    backgroundColor: color.palette.grayLigth,
    borderRadius: spacing[2],
    padding: spacing[4],
    paddingVertical: spacing[5],
  },
  containerBottom: {
    alignSelf: "center",
    justifyContent: "space-between",
    minWidth: 300,
    width: "80%",
  },
  containerCurrentLocation: {
    bottom: 30,
    position: "absolute",
    right: 30,
  },
  containerMarker: {
    alignItems: "center",
    bottom: 50,
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  containerSearch: {
    minWidth: 300,
    position: "absolute",
    top: 0,
    width: "80%",
  },
  heightProgress: {
    height: 5,
  },
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  search: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  textAddress: {
    textAlignVertical: "top",
  },
})
