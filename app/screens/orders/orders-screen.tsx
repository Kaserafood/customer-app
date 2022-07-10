import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { AutoImage, Card, Header, Loader, Price, Screen, Text } from "../../components"
import { OrderOverview, useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing, typography } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

export const OrdersScreen: FC<StackScreenProps<NavigatorParamList, "orders">> = observer(
  function OrdersScreen() {
    const { orderStore, userStore, commonStore } = useStores()
    useEffect(() => {
      __DEV__ && console.log("orders screen: useEffect")
      async function fetchOrders() {
        commonStore.setVisibleLoading(true)
        await orderStore
          .getAll(userStore.userId)
          .finally(() => commonStore.setVisibleLoading(false))
      }
      fetchOrders()
    }, [])

    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
      <Screen style={styles.container} preset="fixed">
        <Header headerTx="ordersScreen.title" leftIcon="back" onLeftPress={goBack} />
        <SegmentedControl
          values={[getI18nText("ordersScreen.inProgress"), getI18nText("ordersScreen.previous")]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
          }}
          appearance="light"
          style={styles.segmentedControl}
          backgroundColor={color.palette.segmentedControl}
          tintColor={color.palette.white}
          activeFontStyle={{ color: color.text, fontFamily: typography.primarySemiBold }}
          fontStyle={{ color: color.text, fontFamily: typography.primarySemiBold }}
        />
        <ScrollView>
          {selectedIndex === 0 ? (
            <ListOrders viewToGetOrders="ordersOverviewInProgress"></ListOrders>
          ) : (
            <ListOrders viewToGetOrders="ordersOverviewCompleted"></ListOrders>
          )}
        </ScrollView>

        <Loader></Loader>
      </Screen>
    )
  },
)

// This type contais the name of the methods declared in the store model "order.ts", into the "views"
type ViewToGetOrders = "ordersOverviewInProgress" | "ordersOverviewCompleted"

/**
 *
 * @description return the order overview filter by status, the prop 'viewToGetOrders' is used to know which orders to get and render
 */
const ListOrders = observer((props: { viewToGetOrders: ViewToGetOrders }) => {
  const { orderStore } = useStores()

  return (
    <View style={utilSpacing.mb5}>
      {orderStore[props.viewToGetOrders].map((order: OrderOverview) => (
        <Order key={order.id} order={order}></Order>
      ))}
    </View>
  )
})

const Order = (props: { order: OrderOverview }) => {
  const { order } = props
  return (
    <Card style={[utilSpacing.mx4, utilSpacing.mt4, utilSpacing.p4]}>
      <View style={utilFlex.flexRow}>
        <View>
          <AutoImage source={{ uri: order.chefImage }} style={styles.chefImage}></AutoImage>
          <Text caption style={[utilFlex.selfCenter, utilSpacing.mt3]} text={`#${order.id}`}></Text>
        </View>
        <View style={utilSpacing.ml3}>
          <Text style={utilSpacing.mb3} preset="bold" text={order.chefName}></Text>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb3]}>
            <Text
              caption
              text={`${order.productCount} ${getI18nText("ordersScreen.articles")} - `}
            ></Text>
            <Price
              style={styles.price}
              currencyCode={order.currencyCode}
              textStyle={utilText.textGray}
              amount={order.total}
            ></Price>
          </View>

          <Text caption text={order.status}></Text>
          <Text caption text={`${order.deliveryDate} ${order.deliverySlotTime}`}></Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  chefImage: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  container: {
    backgroundColor: color.background,
  },
  price: {
    backgroundColor: color.background,
    paddingHorizontal: 0,
  },
  segmentedControl: {
    height: 40,
  },
})
