import React, { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import DeviceInfo from "react-native-device-info"
import { ScrollView } from "react-native-gesture-handler"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Button, Header, InputText, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

import { ModalReportBug } from "./modal-report-bug"
import { Keyboard } from "react-native"
import { getInstanceMixpanel } from "../../utils/mixpanel"

const modalStateReportBug = new ModalStateHandler()
const mixpanel = getInstanceMixpanel()

export const ReportBugScreen: FC<StackScreenProps<NavigatorParamList, "reportBug">> = observer(
  function ReportBugScreen() {
    const { userStore, commonStore, messagesStore } = useStores()
    const { ...methods } = useForm({ mode: "onBlur" })

    useEffect(() => {
      mixpanel.track("Report bug screen")
    }, [])

    const onSubmit = async (data) => {
      const userAgent = await DeviceInfo.getUserAgent()
      const apiLevel = await DeviceInfo.getApiLevel()
      const isLocationEnabled = await DeviceInfo.isLocationEnabled()
      const manufacturer = await DeviceInfo.getManufacturer()

      Keyboard.dismiss()

      const dataReport = {
        userId: userStore.userId,
        description: data.description,
        manufacturer,
        deviceBrand: DeviceInfo.getBrand(),
        deviceModel: DeviceInfo.getModel(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        bundleId: DeviceInfo.getBundleId(),
        buildNumber: DeviceInfo.getBuildNumber(),
        appVersion: DeviceInfo.getVersion(),
        userAgent,
        androidApiLevel: apiLevel,
        isLocationEnabled,
      }

      commonStore.setVisibleLoading(true)
      userStore
        .reportBug(dataReport)
        .then((res) => {
          if (res) {
            messagesStore.showSuccess("reportBugScreen.successToSendBug", true)
            methods.reset()
            modalStateReportBug.setVisible(true)
          } else {
            messagesStore.showSuccess("reportBugScreen.errorToSendBug", true)
          }
          commonStore.setVisibleLoading(false)
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
    }
    const onError = (errors) => {
      console.log(errors)
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="reportBugScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView style={utilSpacing.p6} keyboardShouldPersistTaps={"handled"}>
          <Text tx="reportBugScreen.description"></Text>
          <FormProvider {...methods}>
            <Text
              preset="semiBold"
              tx="reportBugScreen.descriptionError"
              style={[utilSpacing.mt5, utilSpacing.mb2]}
            ></Text>
            <InputText
              name="description"
              rules={{
                required: "reportBugScreen.descriptionRequired",
                minLength: {
                  value: 3,
                  message: "reportBugScreen.minLength",
                },
              }}
              maxLength={1500}
              multiline
              placeholderTx="reportBugScreen.descriptionPlaceholder"
            ></InputText>

            <Button
              onPress={methods.handleSubmit(onSubmit, onError)}
              style={[utilFlex.selfCenter, utilSpacing.mt6]}
              tx="common.send"
            ></Button>
          </FormProvider>
        </ScrollView>
        <ModalReportBug modalState={modalStateReportBug}></ModalReportBug>
      </Screen>
    )
  },
)
