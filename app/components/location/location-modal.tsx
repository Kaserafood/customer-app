import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import IconRN from "react-native-vector-icons/MaterialIcons"
import { AutoImage, Card, Icon, Text } from ".."
import images from "../../assets/images"
import { Address, useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"

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
  modal?: ModalState
}

type homeScreenProp = StackNavigationProp<NavigatorParamList, "home">

/**
 * Modal to select location and add new location
 */
export const LocationModal = observer(function Location(props: LocationProps) {
  const { style, modal } = props

  const { addressStore, userStore } = useStores()
  const navigation = useNavigation<homeScreenProp>()

  const toMap = () => {
    navigation.navigate("map")
  }

  useEffect(() => {
    async function fetch() {
      if (addressStore.addresses.length === 0) await addressStore.getAll(userStore.userId)
    }

    fetch()
  })
  return (
    <Modal
      isVisible={modal?.isVisibleLocation || false}
      backdropColor={color.palette.grayTransparent}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={style}
      coverScreen={false}
      onBackdropPress={() => modal.setVisibleLocation(false)}
      onModalShow={() => changeNavigationBarColor(color.palette.white, true, true)}
    >
      <View style={styles.containerModal}>
        <View style={styles.bodyModal}>
          <View style={styles.containerImgClose}>
            <TouchableOpacity onPress={() => modal.setVisibleLocation(false)} activeOpacity={0.7}>
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
                      style={utilSpacing.mb2}
                      numberOfLines={1}
                      tx="modalLocation.useCurrentLocation"
                    ></Text>
                    <Text
                      numberOfLines={2}
                      caption
                      text="23 avenida, est oes una calle, unaasdfa ciudad, un país"
                    ></Text>
                  </View>
                </View>
              </Card>
            </Ripple>

            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={[styles.btnAddressAdd, utilSpacing.mx5]}
            >
              <Text
                preset="semiBold"
                style={utilFlex.selfCenter}
                tx="modalLocation.addAddress"
              ></Text>
            </Ripple>

            <AddressList></AddressList>
            <ScrollView style={utilSpacing.my6}></ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  )
})

const AddressList = () => {
  const { addressStore } = useStores()
  return (
    <View>
      {addressStore.addresses.map((address) => (
        <AddressItem key={address.id} address={address}></AddressItem>
      ))}
    </View>
  )
}
const AddressItem = (props: { address: Address }) => {
  const address = props.address
  return (
    <Ripple
      rippleOpacity={0.2}
      rippleDuration={400}
      style={[utilSpacing.px5, utilFlex.flexCenterVertical]}
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

        <IconRN name="check-circle" size={30} color={color.primary} />
      </View>
    </Ripple>
  )
}
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
  btnAddress: {
    backgroundColor: color.primary,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
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
  text: {
    flexWrap: "wrap",
  },
  textAddress: {
    color: color.palette.white,
    flex: 1,
    marginLeft: spacing[2],
  },
})
