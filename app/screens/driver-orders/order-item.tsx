import React from "react"
import { StyleSheet, View } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { useMutation } from "react-query"
import { Button, Card, Text } from "../../components"
import Label from "../../components/label/label"
import { useStores } from "../../models"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getI18nText } from "../../utils/translate"

interface Props {
  id: number
  code?: string
  codeCredit?: string
  customerName: string
  quantityItems: number
  pickUpAddress: string
  customerAddress: string
  deliveryTime: string
  border: boolean
  status: string
  isToday?: boolean
  onPress: () => void
  refetch: () => void
  onCheck: (selected: boolean) => void
  isSelected: boolean
  driverConfirmed: boolean
  driverCanceled: boolean
}

const api = new Api()

const OrderItem = ({
  customerName,
  id,
  code,
  codeCredit,
  quantityItems,
  pickUpAddress,
  customerAddress,
  deliveryTime,
  status,
  onPress,
  refetch,
  onCheck,
  isSelected,
  driverCanceled,
  driverConfirmed,
}: Props) => {
  const { messagesStore, commonStore } = useStores()

  const { mutate: confirm } = useMutation(() => api.driverConfirmed([id]), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("ordersChefScreen.orderConfirmed", true)
        refetch()
      } else messagesStore.showError("ordersChefScreen.orderConfirmedError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.orderConfirmedError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const handleConfirm = async (callback) => {
    commonStore.setVisibleLoading(true)
    callback()
  }

  return (
    <Card
      style={[
        utilSpacing.mb5,
        utilSpacing.p4,
        styles.card,
        isSelected && styles.selected,

        // status === "wc-completed" && styles.bgDisabled,
      ]}
    >
      <View style={utilFlex.flexRow}>
        {!driverConfirmed && <BouncyCheckbox onPress={onCheck} fillColor={palette.blue} />}

        <View style={[utilFlex.flexRow, utilFlex.flex1, utilSpacing.mt2]}>
          <Text text={`#${code || codeCredit || id}`} preset="bold"></Text>
          <Text text=" - " preset="bold"></Text>
          <Text text={customerName} preset="bold"></Text>
        </View>

        <Button
          preset="gray"
          style={utilSpacing.mr3}
          tx="common.view"
          size="sm"
          onPress={onPress}
        ></Button>
      </View>

      <View style={utilFlex.flexRow}>
        <Text text={`${quantityItems} ${getI18nText("ordersChefScreen.articles")}`}></Text>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text
            tx="driverOrdersScreen.pickUpAddress"
            preset="semiBold"
            style={utilSpacing.mt3}
          ></Text>
          <Text text={`${pickUpAddress}`}></Text>
        </View>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text
            tx="driverOrdersScreen.deliveryAddress"
            preset="semiBold"
            style={utilSpacing.mt3}
          ></Text>
          <Text text={`${customerAddress}`}></Text>
        </View>
      </View>

      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text
            tx="driverOrdersScreen.deliveryTime"
            preset="semiBold"
            style={utilSpacing.mt3}
          ></Text>
          <Text text={`${deliveryTime}`}></Text>
        </View>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mt5, styles.containerButtons]}>
        <RenderLabel
          completed={status === "wc-completed"}
          driverCanceled={driverCanceled}
          driverConfirmed={driverConfirmed}
          onConfirm={() => handleConfirm(confirm)}
        ></RenderLabel>
      </View>
    </Card>
  )
}

interface PropsLabel {
  completed: boolean
  driverCanceled: boolean
  driverConfirmed: boolean
  onConfirm: () => void
}

const RenderLabel = ({ completed, driverConfirmed, onConfirm, driverCanceled }: PropsLabel) => {
  if (completed) return <Label tx="driverOrdersScreen.delivered" preset="success"></Label>

  if (driverCanceled) return <Label tx="driverOrdersScreen.noDeliver" preset="error"></Label>

  if (driverConfirmed) return <Label tx="ordersChefScreen.aware" preset="info"></Label>
  else
    return (
      <Button
        tx="ordersChefScreen.confirm"
        size="sm"
        style={styles.btnConfirm}
        onPress={onConfirm}
      ></Button>
    )
}

const styles = StyleSheet.create({
  btnConfirm: {
    backgroundColor: palette.green,
  },

  card: {
    borderColor: palette.gray300,
    borderWidth: 1,
  },

  containerButtons: {
    alignSelf: "flex-end",
  },

  selected: {
    backgroundColor: palette.blueBg,
    borderColor: palette.blue,
    borderWidth: 1,
  },
})

export default OrderItem
