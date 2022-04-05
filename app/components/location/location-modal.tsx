import React from "react"
import { StyleProp, View, ViewStyle, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import Images from "assets/images"
import { utilSpacing } from "../../theme/Util"
import { AutoImage } from "../auto-image/auto-image"
import Modal from "react-native-modal"
import { Button } from "../button/button"
import changeNavigationBarColor from "react-native-navigation-bar-color"

import { useStores } from "../../models"
import SvgUri from "react-native-svg-uri"

export interface LocationProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const LocationModal = observer(function Location(props: LocationProps) {
  const { style } = props

  const { modalStore } = useStores()
  return (
    <>
      <Modal
        isVisible={modalStore.isVisibleModalLocaton}
        backdropColor={color.palette.grayTransparent}
        backdropOpacity={1}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={style}
        coverScreen={false}
        onModalShow={() => changeNavigationBarColor(color.palette.whiteGray, true, true)}
      >
        <View style={styles.containerModal}>
          <View style={styles.bodyModal}>
            <View style={styles.containerImgClose}>
              <TouchableOpacity
                onPress={() => modalStore.setVisibleModalLocaton(false)}
                activeOpacity={0.7}
              >
                <AutoImage style={styles.imgClose} source={Images.close}></AutoImage>
              </TouchableOpacity>
            </View>
            <View style={utilSpacing.p4}>
              <Text preset="bold" tx="modalAddress.title" style={utilSpacing.mb5}></Text>

              <TouchableOpacity style={styles.btnAddressAdd} activeOpacity={0.8}>
                <Text preset="semiBold" tx="modalAddress.add"></Text>
              </TouchableOpacity>

              <ScrollView style={utilSpacing.my6}>
                <View style={[styles.containerItemAddress, styles.flex, utilSpacing.mb5]}>
                  <View style={utilSpacing.p4}>
                    <SvgUri height={20} width={20} source={Images.start}></SvgUri>
                  </View>
                  <View>
                    <Text numberOfLines={1} preset="semiBold" tx="modalAddress.addressName"></Text>
                    <Text
                      size="sm"
                      numberOfLines={2}
                      style={styles.addressSubtitle}
                      tx="modalAddress.desc"
                    ></Text>
                  </View>
                </View>
                <View style={[styles.containerItemAddress, styles.flex]}>
                  <View style={utilSpacing.p4}>
                    <SvgUri height={20} width={20} source={Images.startActive}></SvgUri>
                  </View>
                  <View>
                    <Text numberOfLines={1} preset="semiBold" tx="modalAddress.addressName"></Text>
                    <Text
                      numberOfLines={2}
                      size="sm"
                      style={styles.addressSubtitle}
                      tx="modalAddress.desc"
                    ></Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
})

const styles = StyleSheet.create({
  addressSubtitle: {
    color: color.palette.grayDark,
  },
  bodyModal: {
    backgroundColor: color.palette.white,
    borderRadius: 20,
    padding: spacing[3],
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
    borderColor: color.palette.grayDark,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: spacing[4],
    padding: spacing[3],
  },

  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  containerItemAddress: {
    alignItems: "center",
  },
  containerModal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },

  flex: {
    display: "flex",
    flexDirection: "row",
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  textAddress: {
    color: color.palette.white,
    flex: 1,
    marginLeft: spacing[2],
  },
})
