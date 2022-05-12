import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Header, InputText, Loader, Screen } from "../../components"
import { useStores } from "../../models"
import { goBack, NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { showMessageSucess } from "../../utils/messages"

export const AddressScreen: FC<StackScreenProps<NavigatorParamList, "address">> = observer(
  ({ navigation, route: { params } }) => {
    const { ...methods } = useForm({ mode: "onBlur" })
    const { addressStore, commonStore } = useStores()

    const onError: SubmitErrorHandler<any> = (errors) => {
      return console.log({ errors })
    }

    const onSubmit = (data) => {
      console.log(data, params)
      const address = {
        ...data,
        ...params,
      }
      console.log(`MODEL REQUESTE: ${address}`)
      commonStore.setVisibleLoading(true)
      addressStore
        .add(address)
        .then((res) => {
          if (res) {
            showMessageSucess(res.message)
            navigation.navigate("main")
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
              ></InputText>

              <InputText
                preset="card"
                name="numHouseApartmentNumber"
                placeholderTx="addressScreen.houseApartmentNumberPlaceholder"
                rules={{
                  required: "addressScreen.houseApartmentNumberRequired",
                }}
                labelTx="addressScreen.houseApartmentNumber"
                styleContainer={utilSpacing.mb6}
              ></InputText>

              <InputText
                preset="card"
                name="instructionsDelivery"
                placeholderTx="addressScreen.instructionsDeliveryPlaceholder"
                labelTx="addressScreen.instructionsDelivery"
                styleContainer={utilSpacing.mb6}
              ></InputText>

              <InputText
                preset="card"
                name="name"
                placeholderTx="addressScreen.howSaveThisAddressPlaceholder"
                rules={{
                  required: "addressScreen.howSaveThisAddressRequired",
                }}
                labelTx="addressScreen.howSaveThisAddress"
                styleContainer={utilSpacing.mb6}
              ></InputText>

              <InputText
                preset="card"
                name="phone"
                placeholderTx="addressScreen.phoneDeliveryPlaceholder"
                rules={{
                  required: "addressScreen.phoneDeliveryRequired",
                }}
                labelTx="addressScreen.phoneDelivery"
                styleContainer={utilSpacing.mb6}
                keyboardType="phone-pad"
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
