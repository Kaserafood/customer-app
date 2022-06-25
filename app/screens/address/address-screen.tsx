import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Header, InputText, Loader, Screen } from "../../components"
import { useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { getFormatMaskPhone, getMaskLength } from "../../utils/mask"
import { showMessageSucess } from "../../utils/messages"

export const AddressScreen: FC<StackScreenProps<NavigatorParamList, "address">> = observer(
  ({ navigation, route: { params } }) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const { addressStore, commonStore, userStore } = useStores()

    const onError: SubmitErrorHandler<any> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (data) => {
      const address = {
        ...data,
        ...params,
        userId: userStore.userId,
      }
      commonStore.setVisibleLoading(true)
      addressStore
        .add(address)
        .then((res) => {
          if (res) {
            address.id = res.data
            addressStore.setCurrent({ ...address })
            userStore.setAddressId(address.id)
            showMessageSucess(res.message)
            // Regresará a la pantalla de donde halla iniciado el proceso de agregar dirección
            navigation.navigate(params.screenToReturn)
          }
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }

    return (
      <Screen preset="fixed" style={styles.container}>
        <Header headerTx="addressScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <View style={styles.containerForm}>
            <FormProvider {...methods}>
              <InputText
                preset="card"
                name="address"
                placeholderTx="addressScreen.addressPlaceholder"
                rules={{
                  required: "addressScreen.addressCompleteRequired",
                }}
                labelTx="addressScreen.addressComplete"
                styleContainer={[utilSpacing.mb6, utilSpacing.mt6]}
                maxLength={400}
              ></InputText>

              <InputText
                preset="card"
                name="numHouseApartment"
                placeholderTx="addressScreen.houseApartmentNumberPlaceholder"
                labelTx="addressScreen.houseApartmentNumber"
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
                name="instructionsDelivery"
                placeholderTx="addressScreen.instructionsDeliveryPlaceholder"
                labelTx="addressScreen.instructionsDelivery"
                styleContainer={utilSpacing.mb6}
                maxLength={200}
              ></InputText>
            </FormProvider>
          </View>

          <View style={styles.containerButton}>
            <Button
              block
              tx="common.save"
              style={[utilSpacing.m6, styles.button]}
              onPress={methods.handleSubmit(onSubmit, onError)}
            ></Button>
          </View>
        </ScrollView>
        <Loader></Loader>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    minWidth: 260,
    width: "75%",
  },
  container: {
    backgroundColor: color.palette.whiteGray,
  },
  containerButton: {
    backgroundColor: color.background,
  },
  containerForm: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "90%",
  },
})
