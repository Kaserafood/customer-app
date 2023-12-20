import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"

import { Card, Header, Image, Price, Screen, Text } from "../../components"
import { OrderOverview, useStores } from "../../models"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color, spacing, typography } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
import { getInstanceMixpanel } from "../../utils/mixpanel"

const mixpanel = getInstanceMixpanel()

export const OrdersScreen: FC<StackScreenProps<NavigatorParamList, "orders">> = observer(
  function OrdersScreen({ navigation }) {
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
      mixpanel.track("Orders screen")
    }, [])

    const [selectedIndex, setSelectedIndex] = useState(0)

    const toDetail = (order: OrderOverview) => {
      navigation.navigate("orderDetail", { ...order })
    }
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
          style={[styles.segmentedControl, utilSpacing.m5]}
          backgroundColor={color.palette.segmentedControl}
          tintColor={color.palette.white}
          activeFontStyle={{ color: color.text, fontFamily: typography.primarySemiBold }}
          fontStyle={{ color: color.palette.grayDark, fontFamily: typography.primarySemiBold }}
        />
        <ScrollView>
          {selectedIndex === 0 ? (
            <ListOrders
              viewToGetOrders="ordersOverviewInProgress"
              onPress={(order) => toDetail(order)}
            ></ListOrders>
          ) : (
            <ListOrders
              viewToGetOrders="ordersOverviewCompleted"
              onPress={(order) => toDetail(order)}
            ></ListOrders>
          )}
        </ScrollView>
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
const ListOrders = observer(
  (props: { viewToGetOrders: ViewToGetOrders; onPress: (order: OrderOverview) => void }) => {
    const { orderStore } = useStores()

    return (
      <View style={utilSpacing.mb5}>
        {orderStore[props.viewToGetOrders].map((order: OrderOverview) => (
          <Order key={order.id} order={order} onPress={() => props.onPress(order)}></Order>
        ))}
      </View>
    )
  },
)

const Order = (props: { order: OrderOverview; onPress: () => void }) => {
  const { order, onPress } = props
  let articles = ""
  if (order.productCount > 1) articles = getI18nText("ordersScreen.articlesPlural")
  else articles = getI18nText("ordersScreen.articlesSingular")

  return (
    <Ripple rippleOpacity={0.2} rippleDuration={400} onPress={onPress}>
      <Card style={[utilSpacing.mx4, utilSpacing.mt4, utilSpacing.p4]}>
        <View style={utilFlex.flexRow}>
          <View>
            <Image source={{ uri: order.chefImage }} style={styles.chefImage}></Image>
            {/* <Text
              caption
              style={[utilFlex.selfCenter, utilSpacing.mt3]}
              text={`#${order.id}`}
            ></Text> */}
          </View>
          <View style={utilSpacing.ml3}>
            <Text
              style={utilSpacing.mb1}
              preset="bold"
              size="lg"
              text={`#${order.id} - ${order.chefName}`}
            ></Text>
            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.mb2]}>
              <Text caption text={`${order.productCount} ${articles} - `}></Text>
              <Price
                preset="simple"
                currencyCode={order.currencyCode}
                textStyle={utilText.textGray}
                amount={order.total}
              ></Price>
            </View>

            <View style={utilSpacing.mb2}>
              <Text caption text={order.deliveryDate} preset="bold" style={utilSpacing.mr4}></Text>
              <Text caption text={order.deliverySlotTime}></Text>
            </View>

            <Text
              caption
              text={order.status}
              preset="bold"
              style={
                order.woocommerceStatus === "wc-completed" ||
                order.woocommerceStatus === "wc-billing"
                  ? styles.colorGreen
                  : styles.colorOrange
              }
            ></Text>
          </View>
        </View>
      </Card>
    </Ripple>
  )
}

const styles = StyleSheet.create({
  chefImage: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  colorGreen: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.greenBackground,
    borderRadius: spacing[1],
    color: color.palette.green,
    letterSpacing: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  colorOrange: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.amber50,
    borderRadius: spacing[1],
    color: color.palette.amber600,
    letterSpacing: 1,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  container: {
    backgroundColor: color.background,
  },
  segmentedControl: {
    height: 45,
  },
})
