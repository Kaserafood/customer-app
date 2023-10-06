import React from "react"
import { StyleSheet, View } from "react-native"
import { InputText } from "../../components/"

import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"

interface Props {
  onOpenModalLocation: () => void
}

const Fields = ({ onOpenModalLocation }: Props) => {
  // const { userStore, addressStore, plansStore } = useStores()

  // const getAddressText = (): string => {
  //   const address = ""
  //   if (addressStore.current.name && addressStore.current.name.trim().length > 0)
  //     address.concat(" - ")
  //   return address.concat(addressStore.current.address)
  // }

  // const onPressAddress = () => {
  //   console.log("on press address")
  //   onOpenModalLocation()
  //   RNUxcam.logEvent("menu-summary: onPressAddress")
  // }

  return (
    <View>
      <View style={[styles.containerInput, utilSpacing.py4]}>
        <InputText
          name="commentToChef"
          preset="card"
          labelTx="menuSummary.commentChef"
          placeholderTx="common.writeHere"
          counter={100}
        ></InputText>

        {/* {plansStore.id > 0 && (
          <>
            <Text
              preset="bold"
              size="lg"
              tx="checkoutScreen.info"
              style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
            ></Text>
            <Ripple rippleOpacity={0.2} rippleDuration={400} onPress={onPressAddress}>
              <InputText
                name="address"
                preset="card"
                labelTx="checkoutScreen.address"
                placeholderTx="checkoutScreen.addressPlaceholder"
                editable={false}
                value={getAddressText()}
                iconRight={<Icon name="angle-right" size={18} color={color.palette.grayDark} />}
              ></InputText>
            </Ripple>

            <InputText
              name="customerNote"
              preset="card"
              labelTx="checkoutScreen.deliveryNote"
              placeholderTx="checkoutScreen.deliveryNotePlaceholder"
              value={addressStore.current.instructionsDelivery}
            ></InputText>
          </>
        )} */}
      </View>
    </View>
  )
}

export default Fields
const styles = StyleSheet.create({
  containerInput: {
    backgroundColor: color.palette.whiteGray,
  },
})
