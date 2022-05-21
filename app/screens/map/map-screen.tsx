import { StackScreenProps } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import ProgressBar from "react-native-animated-progress"
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps"
import { useLocation } from "../../common/hooks/useLocation"
import { Button, Header, Icon, InputText, Screen, Text } from "../../components"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError } from "../../utils/messages"
import { getI18nText } from "../../utils/translate"

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
    const { fetchAddressText, location, permission, setLocation } = useLocation()
    const [address, setAddress] = useState("")

    const { ...methods } = useForm({ mode: "onBlur" })
    let timeOut: NodeJS.Timeout

    useEffect(() => {
      // Request permision to access the location and then enable the location from the device
      permission()
    }, [])

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
        showMessageError(getI18nText("mapScreen.noLocation"))
      }
    }

    const onRegionChange = (region: Region) => {
      clearTimeout(timeOut)
      timeOut = setTimeout(() => {
        if (location.latitude !== region.latitude && location.longitude !== region.longitude) {
          console.log(`Change region2: ${JSON.stringify(region)}`)

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
            <Icon name="location" size={50} color={color.primary}></Icon>
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
