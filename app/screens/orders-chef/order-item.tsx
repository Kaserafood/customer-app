import React from "react"
import { StyleSheet, View } from "react-native"
import { useMutation } from "react-query"
import { Button, Card, Price, Text } from "../../components"
import { useStores } from "../../models"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getI18nText } from "../../utils/translate"

interface Props {
  id: number
  customerName: string
  quantityItems: number
  total: number
  deliveryTime: string
  border: boolean
  status: string
  isToday?: boolean
  onPress: () => void
  refetch: () => void
}

const api = new Api()

const OrderItem = ({
  customerName,
  id,
  quantityItems,
  total,
  deliveryTime,
  border,
  status,
  isToday,
  onPress,
  refetch,
}: Props) => {
  const { userStore, messagesStore, commonStore } = useStores()

  const { mutate: confirm } = useMutation(() => api.updateOrderStatus(id, "wc-confirmed"), {
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

  const { mutate: reject } = useMutation(() => api.updateOrderStatus(id, "rejected"), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("ordersChefScreen.orderRejected", true)
        refetch()
      } else messagesStore.showError("ordersChefScreen.orderRejectedError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.orderRejectedError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const { mutate: onRoute } = useMutation(() => api.updateOrderStatus(id, "wc-on-route"), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("ordersChefScreen.orderOnRouteConfirm", true)
        refetch()
      } else messagesStore.showError("ordersChefScreen.orderOnRouteError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.orderOnRouteError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const handleChangeStatus = async (callback) => {
    commonStore.setVisibleLoading(true)
    callback()
  }

  return (
    <Card
      style={[utilSpacing.mb5, utilSpacing.p4, border && status !== "wc-on-route" && styles.border]}
    >
      <View style={utilFlex.flexRow}>
        <View style={[utilFlex.flexRow, utilFlex.flex1]}>
          <Text text={`#${id}`} preset="bold"></Text>
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
        <Text text=" - "></Text>

        <Price
          preset="simple"
          amount={+total}
          textStyle={utilText.regular}
          currencyCode={userStore.account.currency}
        />
      </View>
      <View style={utilFlex.flexRow}>
        <View style={utilFlex.flex1}>
          <Text tx="ordersChefScreen.delivery" preset="semiBold" style={utilSpacing.mt3}></Text>
          <Text text={`${deliveryTime}`}></Text>
        </View>
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mt5, styles.containerButtons]}>
        {status === "wc-pending-confirmation" && (
          <>
            {/* <Button
              preset="primary"
              style={utilSpacing.mr3}
              tx="ordersChefScreen.reject"
              size="sm"
              onPress={() => handleChangeStatus(reject)}
            ></Button> */}
            <Button
              tx="ordersChefScreen.confirm"
              size="sm"
              style={styles.btnConfirm}
              onPress={() => handleChangeStatus(confirm)}
            ></Button>
          </>
        )}

        {status === "wc-confirmed" && !isToday && (
          <View style={[styles.status, styles.bgBlue, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx="ordersChefScreen.aware"
              preset="semiBold"
              size="lg"
              style={styles.confirm}
            ></Text>
          </View>
        )}

        {status === "wc-confirmed" && isToday && (
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <Text
              tx="ordersChefScreen.orderOnRoute"
              style={utilSpacing.mr4}
              preset="semiBold"
            ></Text>
            <Button
              tx="common.yes"
              size="sm"
              style={[styles.btnConfirm, utilSpacing.px4]}
              onPress={() => handleChangeStatus(onRoute)}
            ></Button>
          </View>
        )}

        {status === "wc-on-route" && isToday && (
          <View style={[styles.status, styles.bgAmber, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx="ordersChefScreen.delivered"
              preset="semiBold"
              size="lg"
              style={styles.amber}
            ></Text>
          </View>
        )}

        {status === "wc-completed" && (
          <View style={[styles.status, styles.bgGreen, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx="ordersChefScreen.completed"
              preset="semiBold"
              size="lg"
              style={styles.green}
            ></Text>
          </View>
        )}

        {(status === "rejected" || status === "wc-cancelled") && (
          <View style={[styles.status, styles.bgError, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx={`${
                status === "rejected" ? "ordersChefScreen.rejected" : "ordersChefScreen.cancelled"
              }`}
              preset="semiBold"
              size="lg"
              style={styles.error}
            ></Text>
          </View>
        )}
      </View>
    </Card>
  )
}

interface PropsStatus {
  status:
    | "pending-confirmation"
    | "confirmed"
    | "on-route"
    | "completed"
    | "invoiced"
    | "payment-made"
    | "refunded"
    | "cancelled"
    | "rejected"
}

const styles = StyleSheet.create({
  amber: {
    color: palette.amber600,
    letterSpacing: 0.6,
  },
  bgAmber: {
    backgroundColor: palette.amber50,
  },
  bgBlue: {
    backgroundColor: palette.blueBg,
  },
  bgError: {
    backgroundColor: palette.errorBg,
  },

  bgGreen: {
    backgroundColor: palette.greenBackground,
  },

  border: {
    borderColor: palette.yellow,
    borderWidth: 1,
  },
  btnConfirm: {
    backgroundColor: palette.green,
  },
  confirm: {
    color: palette.blue,
    letterSpacing: 0.6,
  },
  containerButtons: {
    alignSelf: "flex-end",
  },
  error: {
    color: palette.error,
    letterSpacing: 0.6,
  },
  green: {
    color: palette.green,
    letterSpacing: 0.6,
  },
  status: {
    borderRadius: 8,
  },
})

export default OrderItem
