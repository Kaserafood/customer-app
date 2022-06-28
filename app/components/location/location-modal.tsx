import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { AutoImage, Card, Icon, Text } from ".."
import images from "../../assets/images"
import { useLocation } from "../../common/hooks/useLocation"
import { Address, useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

class ModalPersistent {
  isPersistent = false

  setPersistent(persistent: boolean) {
    this.isPersistent = persistent
  }

  constructor() {
    makeAutoObservable(this)
  }
}
interface ModalState {
  isVisibleLocation: boolean
  setVisibleLocation: (state: boolean) => void
}
export interface LocationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Modal state to handle visibility
   */
  modal: ModalState

  /**
   * Screen to navigate to when user select location
   */
  screenToReturn: "main" | "deliveryDetail"
}

type homeScreenProp = StackNavigationProp<NavigatorParamList, "home">

/**
 * Modal to select location and add new location
 */
const modalPersistent = new ModalPersistent()
export const LocationModal = observer(function Location(props: LocationProps) {
  const { style, modal, screenToReturn } = props

  const { addressStore, userStore } = useStores()
  const [addressText, setAddressText] = useState("")
  const navigation = useNavigation<homeScreenProp>()
  const { permission, fetchAddressText } = useLocation()

  const toMap = () => {
    navigation.navigate("map", { screenToReturn: screenToReturn })
  }

  useEffect(() => {
    async function fetch() {
      if (userStore.userId && userStore.userId > 0)
        if (addressStore.addresses.length === 0) {
          __DEV__ && console.log("GETTING ADDRESS LISET USER")
          await addressStore.getAll(userStore.userId)
          const address = addressStore.addresses.find(
            (address) => address.id === userStore.addressId,
          )

          if (!address) {
            modalPersistent.setPersistent(true)
          } else addressStore.setCurrent({ ...address })
        }
    }

    fetch()
  }, [userStore.userId])

  useEffect(() => {
    if (modal.isVisibleLocation && addressText.length === 0) {
      permission().then((location) => {
        if (location.latitude !== 0 && location.longitude !== 0) {
          fetchAddressText(location.latitude, location.longitude).then((address) => {
            if (address) {
              setAddressText(address.formatted)
            }
          })
        }
      })
    }
  }, [modal.isVisibleLocation])

  const hideModal = () => {
    if (!modalPersistent.isPersistent) modal.setVisibleLocation(false)
  }

  return (
    <Modal
      isVisible={modal.isVisibleLocation || modalPersistent.isPersistent}
      backdropColor={color.palette.grayTransparent}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={style}
      coverScreen={false}
      onBackdropPress={() => {
        hideModal()
      }}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
    >
      <View style={styles.containerModal}>
        <View style={styles.bodyModal}>
          <View style={styles.containerImgClose}>
            <TouchableOpacity
              onPress={() => {
                hideModal()
              }}
              activeOpacity={0.7}
            >
              <AutoImage style={styles.imgClose} source={images.close}></AutoImage>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              numberOfLines={1}
              preset="bold"
              size="lg"
              tx="modalLocation.title"
              style={[utilSpacing.mb5, utilFlex.selfCenter]}
            ></Text>

            <Ripple
              style={utilSpacing.px5}
              rippleOpacity={0.2}
              rippleDuration={400}
              onPressIn={toMap}
            >
              <Card>
                <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                  <View style={[styles.button, utilSpacing.mr3, utilFlex.flexCenter]}>
                    <Icon name="location" color={color.palette.white} size={24}></Icon>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text
                      preset="bold"
                      numberOfLines={1}
                      tx="modalLocation.useCurrentLocation"
                    ></Text>
                    {addressText.length > 0 && (
                      <Text
                        numberOfLines={2}
                        style={utilSpacing.mt2}
                        caption
                        text={addressText}
                      ></Text>
                    )}
                  </View>
                </View>
              </Card>
            </Ripple>

            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={[styles.btnAddressAdd, utilSpacing.mx5]}
              onPressIn={toMap}
            >
              <Text
                preset="semiBold"
                style={utilFlex.selfCenter}
                tx="modalLocation.addAddress"
              ></Text>
            </Ripple>

            <AddressList></AddressList>
          </View>
        </View>
      </View>
    </Modal>
  )
})

const AddressList = observer(() => {
  const { addressStore } = useStores()
  return (
    <ScrollView style={styles.containerList}>
      {addressStore.addresses.map((address) => (
        <AddressItem key={address.id} address={address}></AddressItem>
      ))}
    </ScrollView>
  )
})

const AddressItem = observer((props: { address: Address }) => {
  const address = props.address

  const { userStore, addressStore } = useStores()
  const updateAddressId = (addressId: number) => {
    userStore.updateAddresId(userStore.userId, addressId)
    addressStore.setCurrent({ ...address })
    modalPersistent.setPersistent(false)
  }

  return (
    <Ripple
      rippleOpacity={0.2}
      rippleDuration={400}
      style={[utilSpacing.px5, utilFlex.flexCenterVertical]}
      onPress={() => updateAddressId(address.id)}
    >
      <View style={[utilFlex.flexRow, utilSpacing.py3]}>
        <View style={utilFlex.flex1}>
          <Text numberOfLines={1} preset="semiBold" text={address.name}></Text>
          <Text
            size="sm"
            numberOfLines={2}
            style={styles.addressSubtitle}
            text={address.address}
          ></Text>
        </View>
        {addressStore.current.id === address.id && (
          <Animated.View entering={ZoomIn} exiting={ZoomOut}>
            <IconRN name="check-circle" size={30} color={color.primary} />
          </Animated.View>
        )}
      </View>
    </Ripple>
  )
})
const styles = StyleSheet.create({
  addressSubtitle: {
    color: color.palette.grayDark,
  },
  bodyModal: {
    backgroundColor: color.palette.white,
    borderRadius: 20,
    paddingVertical: spacing[3],
    width: "90%",
  },
  btnAddressAdd: {
    borderColor: color.palette.grayLigth,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: spacing[4],
    padding: spacing[3],
  },

  button: {
    backgroundColor: color.primary,
    borderRadius: 100,
    height: 40,
    padding: spacing[2],
    width: 40,
  },
  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
    marginEnd: spacing[3],
  },

  containerList: {
    maxHeight: 300,
  },
  containerModal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  imgClose: {
    height: 20,
    width: 20,
  },
})
