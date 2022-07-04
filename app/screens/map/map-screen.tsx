import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { useLocation } from "../../common/hooks/useLocation"
import { Button, Header, Screen, Text } from "../../components"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError } from "../../utils/messages"
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

interface Address {
  city: string
  region: string
  formatted: string
  country: string
}

const loadingState = new LoadingState()

export const MapScreen: FC<StackScreenProps<NavigatorParamList, "map">> = observer(
  ({ navigation, route: { params } }) => {
    const { fetchAddressText, location, permission, setLocation } = useLocation()
    const [address, setAddress] = useState<Address>({
      city: "",
      country: "",
      formatted: getI18nText("mapScreen.addressPlaceholder"),
      region: "",
    })
    let timeOut: NodeJS.Timeout

    useEffect(() => {
      // Request permision to access the location and then enable the location from the device
      permission()
        .then((location) => {
          fetchAddressText(location.latitude, location.longitude).then((address) => {
            address && setAddress(address)
          })
        })
        .finally(() => loadingState.setLoading(false))
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
        showMessageError(getI18nText("mapScreen.noLocation"))
      }
    }

    const onRegionChange = (region: Region) => {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {
        if (location.latitude !== region.latitude && location.longitude !== region.longitude) {
          __DEV__ && console.log(`Change region2: ${JSON.stringify(region)}`)

          setLocation({ ...region })
          loadingState.setLoading(true)
          fetchAddressText(region.latitude, region.longitude)
            .then((address) => {
              if (address) {
                setAddress(address)
              }
            })
            .finally(() => loadingState.setLoading(false))
        }
      }, 1500)
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
            <IconRN name="place" size={50} color={color.primary}></IconRN>
          </View>
        </View>
        {loadingState.loading ? (
          <ProgressBar
            height={7}
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

            <View style={styles.containerAddress}>
              <Text text={address.formatted} style={styles.textAddrres}></Text>
            </View>
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
