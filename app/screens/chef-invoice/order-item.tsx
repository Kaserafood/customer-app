import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Card, Price, Text } from "../../components"
import { useStores } from "../../models"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"

interface Props {
  id: number
  code?: string
  codeCredit?: string
  customerName: string
  total: number
  border: boolean
  status: string
  isToday?: boolean
  tax: string
  revenue: number
  paidChef: boolean
  onPress: () => void
  refetch: () => void
  onUpload: () => void
}

const OrderItem = ({
  customerName,
  id,
  code,
  codeCredit,
  total,
  revenue,
  border,
  status,
  paidChef,
  tax,
  onPress,
  onUpload,
}: Props) => {
  const { userStore } = useStores()

  return (
    <Card
      style={[utilSpacing.mb5, utilSpacing.p4, border && status !== "wc-on-route" && styles.border]}
    >
      <View style={utilFlex.flexRow}>
        <View style={[utilFlex.flexRow, utilFlex.flex1]}>
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

      <View>
        {userStore.account?.isGeneralRegime ? (
          <Text style={utilSpacing.mb3}>
            <Text preset="semiBold" tx="chefInvoiceScreen.amountInvoice"></Text>
            <Text text=": " preset="semiBold"></Text>
            <Price preset="simple" amount={+revenue} textStyle={utilText.regular} />
          </Text>
        ) : (
          <Text style={utilSpacing.mb3}>
            <Text preset="semiBold" tx="chefInvoiceScreen.amountInvoice"></Text>
            <Text text=": " preset="semiBold"></Text>
            <Price
              preset="simple"
              amount={+total}
              textStyle={utilText.regular}
              currencyCode={userStore.account.currency}
            />
          </Text>
        )}

        {!userStore.account?.isGeneralRegime && (
          <Text>
            <Text preset="semiBold" tx="common.tax"></Text>
            <Text text=": " preset="semiBold"></Text>
            <Text text={tax}></Text>
          </Text>
        )}

        {paidChef && (
          <View
            style={[
              styles.status,
              styles.bgGreen,
              utilSpacing.px5,
              utilSpacing.py2,
              utilSpacing.mt3,
            ]}
          >
            <Text
              tx="chefInvoiceScreen.paid"
              preset="semiBold"
              size="lg"
              style={styles.green}
            ></Text>
          </View>
        )}
      </View>

      <View style={[utilFlex.flexRow, utilSpacing.mt5, styles.containerButtons]}>
        {status !== "wc-cancelled" &&
          status !== "wc-billing" &&
          !userStore.account?.isGeneralRegime && (
            <Button
              tx="chefInvoiceScreen.uploadInvoice"
              size="sm"
              style={styles.bgAmber}
              onPress={onUpload}
            ></Button>
          )}

        {status === "wc-cancelled" && (
          <View style={[styles.status, styles.bgError, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx="ordersChefScreen.cancelled"
              preset="semiBold"
              size="lg"
              style={styles.error}
            ></Text>
          </View>
        )}

        {status === "wc-billing" && (
          <View style={[styles.status, styles.bgBlue, utilSpacing.px5, utilSpacing.py2]}>
            <Text
              tx="chefInvoiceScreen.invoiced"
              preset="semiBold"
              size="lg"
              style={styles.blue}
            ></Text>
          </View>
        )}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  bgAmber: {
    backgroundColor: palette.green,
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

  blue: {
    color: palette.blue,
    letterSpacing: 0.6,
  },
  border: {
    borderColor: palette.yellow,
    borderWidth: 1,
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
  },
  status: {
    alignSelf: "flex-start",
    borderRadius: 8,
  },
})

export default OrderItem
