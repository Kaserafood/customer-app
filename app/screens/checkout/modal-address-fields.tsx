import React, { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Button, InputText, Modal, Text } from "../../components"
import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { GUATEMALA } from "../../utils/constants"
import { getMaskLength } from "../../utils/mask"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalState } from "../../utils/modalState"

interface Props {
  state: ModalState
  onOkPress: (data) => void
}
const mixpanel = getInstanceMixpanel()

const ModalAddressFields: FC<Props> = ({ state, onOkPress }) => {
  const { countryStore, userStore } = useStores()

  const methods = useForm({ mode: "onBlur" })

  const onSubmit = (data) => {
    mixpanel.track("Address modal OK")
    onOkPress(data)
    state.setVisible(false)
  }

  const handleHide = () => {
    mixpanel.track("Address modal Cancel")
    state.setVisible(false)
  }

  return (
    <Modal state={state} position="bottom">
      <FormProvider {...methods}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={utilSpacing.px4}>
            <Text text="Datos adicionales de la dirección" size="xl" preset="bold"></Text>
            <Text text="Todos los campos son opcionales" style={utilSpacing.mb3}></Text>
          </View>

          <View>
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
              name="name"
              placeholderTx="addressScreen.howSaveThisAddressPlaceholder"
              labelTx="addressScreen.howSaveThisAddress"
              styleContainer={utilSpacing.mb6}
              maxLength={50}
            ></InputText>

            <InputText
              preset="card"
              name="phone"
              keyboardType="phone-pad"
              placeholderTx="registerFormScreen.phone"
              styleContainer={utilSpacing.mb4}
              rules={{
                minLength: {
                  value: getMaskLength(countryStore.selectedCountry?.maskPhone || ""),
                  message:
                    userStore.countryId === GUATEMALA
                      ? "registerFormScreen.phoneFormatIncorrectGt"
                      : "registerFormScreen.phoneFormatIncorrect",
                },
              }}
              labelTx="addressScreen.phoneDelivery"
              mask={countryStore.selectedCountry?.maskPhone}
            ></InputText>
          </View>

          <View style={[utilFlex.flexRow, utilSpacing.mx4, utilSpacing.mb3]}>
            <Button
              tx="common.cancel"
              preset="gray"
              style={[utilFlex.flex1, utilSpacing.mr2]}
              onPress={handleHide}
            ></Button>

            <Button
              tx="common.ok"
              style={[utilFlex.flex1, utilSpacing.ml2]}
              onPress={methods.handleSubmit(onSubmit)}
            ></Button>
          </View>
        </ScrollView>
      </FormProvider>
    </Modal>
  )
}

export default ModalAddressFields
