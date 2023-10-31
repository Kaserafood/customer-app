import React from "react"
import { View } from "react-native"
import { Button, Icon, Modal, Text } from ".."
import { useStores } from "../../models"
import { utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { openWhatsApp } from "../../utils/linking"
import { ModalStateHandler } from "../../utils/modalState"

export const ModalWithoutCoverageCredits = (props: { modalState: ModalStateHandler }) => {
  const { modalState } = props
  const { commonStore, messagesStore, userStore } = useStores()

  const handleWhatsApp = async () => {
    commonStore.setVisibleLoading(true)

    await commonStore
      .getPhoneSupport()
      .catch(() => {
        messagesStore.showError()
      })
      .finally(() => {
        commonStore.setVisibleLoading(false)
      })
    openWhatsApp(commonStore.phoneNumber, "modalWithoutCoverageCredits.whatsAppMessage")
  }

  return (
    <Modal state={modalState} size="md">
      <View style={utilSpacing.p3}>
        <Text
          preset="bold"
          size="lg"
          style={utilSpacing.pb5}
          tx="modalWithoutCoverageCredits.title"
        ></Text>
        <Text tx="modalWithoutCoverageCredits.info" style={utilSpacing.pb6}></Text>

        {/* Guatemala country  */}
        {userStore.countryId === 1 && (
          <View style={utilSpacing.px4}>
            <Button
              style={utilSpacing.mb3}
              block
              onPress={handleWhatsApp}
              iconLeft={
                <Icon name="whatsapp" style={utilSpacing.mr1} size={24} color={palette.white} />
              }
              tx="common.moreInfo"
            ></Button>
          </View>
        )}
      </View>
    </Modal>
  )
}
