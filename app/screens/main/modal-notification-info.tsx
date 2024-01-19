import React, { FC } from "react"
import { View } from "react-native"
import { Button, Modal, Text } from "../../components"
import { useStores } from "../../models"
import { utilSpacing } from "../../theme/Util"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalState } from "../../utils/modalState"

interface Props {
  state: ModalState
  enablePress: () => void
}

const mixpanel = getInstanceMixpanel()

const ModalNotificationInfo: FC<Props> = ({ state, enablePress }) => {
  const { userStore } = useStores()
  const handleHideModal = () => {
    mixpanel.track("Not enabled notifications")
    state.setVisible(false)
    userStore.setRequestEnableNotification(false)
  }

  const handleEnable = () => {
    mixpanel.track("Press enable notifications")
    enablePress()
  }

  return (
    <Modal state={state} onHide={handleHideModal}>
      <View style={utilSpacing.p4}>
        <Text tx="common.dontLeaveOffer" preset="bold" size="xl" style={utilSpacing.mb4}></Text>
        <Text tx="common.enableNotifications"></Text>

        <Button
          preset="primary"
          tx="common.activateNotifications"
          style={[utilSpacing.mt6, utilSpacing.mb4]}
          onPress={handleEnable}
          block
        ></Button>
        <Button
          preset="gray"
          tx="common.notNow"
          style={utilSpacing.mb3}
          onPress={handleHideModal}
          block
        ></Button>
      </View>
    </Modal>
  )
}

export default ModalNotificationInfo
