import React, { FC, useEffect, useRef } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Button, Header, InputText, Screen } from "../../components"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getFormatMaskPhone, getMaskLength } from "../../utils/mask"
import { saveString } from "../../utils/storage"

export const AddressScreen: FC<StackScreenProps<NavigatorParamList, "address">> = observer(
  ({ navigation, route: { params } }) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const { addressStore, commonStore, userStore, messagesStore, deliveryStore } = useStores()
    const fieldAddress = useRef(null)

    const address = methods.watch("address")

    useEffect(() => {
      fieldAddress.current.focus()
    }, [])

    const onError: SubmitErrorHandler<any> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (data) => {
      const address = {
        ...data,
        ...params,
        userId: userStore.userId,
      }
      // Si el usuario entró como "Explorar el app"
      if (userStore.userId === -1) {
        // Guardamos de forma local su dirección porque aun no se ha registrado
        addressStore.setCurrent({ ...address })
        userStore.setAddressId(-1)
        saveString("address", JSON.stringify(address))
        messagesStore.showSuccess("addressScreen.addressSaved", true)
        deliveryStore
          .getPriceDeliveryByCity(address.latitude, address.longitude)
          .catch((error: Error) => {
            messagesStore.showError(error.message)
          })
        navigation.navigate(params.screenToReturn)
      } else {
        commonStore.setVisibleLoading(true)
        addressStore
          .add(address)
          .then((res) => {
            if (res) {
              address.id = res.data
              addressStore.setCurrent({ ...address })
              userStore.setAddressId(address.id)
              messagesStore.showSuccess(res.message)
              deliveryStore.getPriceDelivery(address.id).catch((error: Error) => {
                messagesStore.showError(error.message)
              })
              // Regresará a la pantalla de donde halla iniciado el proceso de agregar dirección
              navigation.navigate(params.screenToReturn)
            }
          })
          .catch((error: Error) => {
            messagesStore.showError(error.message)
          })
          .finally(() => commonStore.setVisibleLoading(false))
      }
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="addressScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView style={[utilFlex.flex1, styles.container]} keyboardShouldPersistTaps="handled">
          <View style={[styles.containerForm, utilSpacing.px3]}>
            <FormProvider {...methods}>
              <InputText
                preset="card"
                forwardedRef={fieldAddress}
                name="address"
                placeholderTx="addressScreen.addressPlaceholder"
                rules={{
                  required: "addressScreen.addressCompleteRequired",
                }}
                labelTx="addressScreen.addressComplete"
                styleContainer={[utilSpacing.mb6, utilSpacing.mt6]}
                maxLength={400}
                required
              ></InputText>

              <InputText
                preset="card"
                name="numHouseApartment"
                placeholderTx="addressScreen.houseApartmentNumberPlaceholder"
                labelTx="addressScreen.houseApartmentNumber"
                styleContainer={[utilSpacing.mb6]}
                maxLength={50}
              ></InputText>

              <InputText
                preset="card"
                name="instructionsDelivery"
                placeholderTx="addressScreen.instructionsDeliveryPlaceholder"
                labelTx="addressScreen.instructionsDelivery"
                styleContainer={utilSpacing.mb6}
                maxLength={200}
              ></InputText>

              <InputText
                preset="card"
                name="name"
                placeholderTx="addressScreen.howSaveThisAddressPlaceholder"
                labelTx="addressScreen.howSaveThisAddress"
                styleContainer={utilSpacing.mb6}
                maxLength={50}
              ></InputText>

              <InputText
                preset="card"
                name="phone"
                placeholderTx="addressScreen.phoneDeliveryPlaceholder"
                rules={{
                  minLength: {
                    value: getMaskLength(getFormatMaskPhone()),
                    message: "addressScreen.phoneFormatIncorrect",
                  },
                }}
                labelTx="addressScreen.phoneDelivery"
                styleContainer={utilSpacing.mb6}
                keyboardType="phone-pad"
                mask={getFormatMaskPhone()}
              ></InputText>
            </FormProvider>
          </View>
        </ScrollView>

        <View style={styles.containerButtons}>
          <View style={[utilFlex.flexRow, utilSpacing.px3, utilSpacing.py4, utilSpacing.mx4]}>
            <Button
              block
              tx="common.save"
              style={[utilFlex.flex1, utilSpacing.ml2]}
              onPress={methods.handleSubmit(onSubmit, onError)}
            ></Button>
          </View>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btnOmit: {
    borderColor: color.palette.whiteGray,
    borderWidth: 1,
  },

  container: {
    backgroundColor: color.palette.whiteGray,
  },

  containerButtons: {
    borderTopColor: color.palette.whiteGray,
    borderTopWidth: 1,
  },
  containerForm: {
    alignSelf: "center",
    flex: 1,

    minWidth: 300,
    width: "100%",
  },

  containerHelper: {
    bottom: -18,
    position: "absolute",
  },
  textHelper: {
    color: color.palette.orangeDarker,
  },
})
