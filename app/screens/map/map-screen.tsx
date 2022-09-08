import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import { TouchableOpacity } from "react-native-gesture-handler"
import MapView, { Region } from "react-native-maps"
import Ripple from "react-native-material-ripple"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { Address, Location, useLocation } from "../../common/hooks/useLocation"
import { Button, Header, Icon, Screen, Text } from "../../components"
import { ModalAutocomplete } from "../../components/search-bar-autocomplete/modal-autocomplete"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError } from "../../utils/messages"
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
    const { fetchAddressText, getCurrentPosition } = useLocation()
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
            .finally(() => loadingState.setLoading(false))
        } else {
          loadingState.setLoading(false)
          showMessageError("mapScreen.canNotGetLocation", true)
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
        showMessageError("mapScreen.noLocation", true)
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
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onCurrentLocation}
                style={[styles.buttonLocation, utilFlex.flexCenter]}
              >
                <Icon name="location-crosshairs" size={33} color={color.text}></Icon>
              </TouchableOpacity>
            </View>
          )}
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
          <View>
            <Text
              tx="mapScreen.whereReciveFood"
              preset="bold"
              size="lg"
              style={utilSpacing.my4}
            ></Text>

            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={styles.containerAddress}
              onPress={() => modalAddressState.setVisible(true)}
            >
              <Text text={address.formatted} style={styles.textAddrres}></Text>
            </Ripple>
          </View>

          <Button
            onPressIn={toAddress}
            block
            preset="primary"
            style={[utilFlex.selfCenter, utilSpacing.mb4]}
            tx="common.next"
          ></Button>
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
  container: {
    alignItems: "center",
    height: "60%",
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
  containerCurrentLocation: {
    right: 30,
    position: "absolute",
    top: 30,
  },
  heightProgress: {
    height: 5,
  },
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  textAddrres: {
    textAlignVertical: "top",
  },
  buttonLocation: {
    borderRadius: 100,
    height: 55,
    width: 55,
    backgroundColor: color.palette.white,
    ...SHADOW,
  },
})
