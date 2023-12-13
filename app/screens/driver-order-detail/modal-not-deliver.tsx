import React from "react"

import { FormProvider, useForm } from "react-hook-form"
import { View } from "react-native"
import { useMutation } from "react-query"
import { Button, InputText, Modal, Text } from "../../components"
import { useStores } from "../../models"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"

interface Props {
  modalState: ModalState
  orderId: number
  onCancel: () => void
}

const api = new Api()
const ModalNotDeliver = ({ modalState, orderId, onCancel }: Props) => {
  const { messagesStore, userStore, commonStore } = useStores()

  const methods = useForm({
    defaultValues: {
      reason: "",
    },
  })

  const { mutate: complete } = useMutation(
    (reason: string) => api.driverCancelOrder(orderId, userStore.userId, reason),
    {
      onSuccess: (data) => {
        if (data.data?.value) {
          modalState.setVisible(false)
          messagesStore.showSuccess("driverOrderDetailScreen.orderCanceled", true)
          onCancel()
        } else messagesStore.showError("driverOrderDetailScreen.orderCanceledError", true)
      },

      onError: () => {
        messagesStore.showError("driverOrderDetailScreen.orderCanceledError", true)
      },
      onSettled: () => {
        commonStore.setVisibleLoading(false)
      },
    },
  )

  const { handleSubmit } = methods

  const onSubmit = ({ reason }: { reason: string }) => {
    commonStore.setVisibleLoading(true)
    complete(reason)
  }

  return (
    <Modal state={modalState}>
      <View style={utilSpacing.p3}>
        <Text size="lg" preset="bold" tx="driverOrderDetailScreen.indicateTheReason"></Text>

        <FormProvider {...methods}>
          <View style={utilSpacing.my5}>
            <InputText
              name="reason"
              placeholderTx="driverOrderDetailScreen.reason"
              numberOfLines={1}
              rules={{
                required: "driverOrderDetailScreen.reasonRequired",
              }}
            ></InputText>
          </View>
        </FormProvider>

        <View style={[utilFlex.flexRow, utilSpacing.mt5]}>
          <Button
            tx="common.cancel"
            preset="gray"
            style={[utilFlex.flex1, utilSpacing.mr2]}
            onPress={() => modalState.setVisible(false)}
          ></Button>
          <Button
            tx="common.confirm"
            onPress={handleSubmit(onSubmit)}
            style={[utilFlex.flex1, utilSpacing.ml2]}
          ></Button>
        </View>

        <Text size="lg" preset="bold"></Text>
      </View>
    </Modal>
  )
}

export default ModalNotDeliver
