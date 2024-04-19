import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { Card, Header, Price, Screen, Separator, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { getI18nText } from "../../utils/translate"

const mixpanel = getInstanceMixpanel()

export const OrderDetailScreen: FC<StackScreenProps<NavigatorParamList, "orderDetail">> = observer(
  function OrderDetailScreen({ route: { params } }) {
    const { orderStore, commonStore } = useStores()
    useEffect(() => {
      async function fetch() {
        commonStore.setVisibleLoading(true)
        await orderStore.getDetail(params.id).finally(() => commonStore.setVisibleLoading(false))
      }
      fetch()
      mixpanel.track("Order detail screen")
    }, [])

    const getTitle = () => {
      return `${getI18nText("orderDetailScreen.order")} #${params.id}`
    }

    return (
      <Screen preset="fixed">
        <Header headerText={getTitle()} leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <View style={utilSpacing.px5}>
            <Card style={[utilSpacing.my5, utilSpacing.px4, utilSpacing.py6]}>
              <Text tx="endOrderScreen.deliveryOn" caption preset="semiBold"></Text>
              <Text text={orderStore.orderDetail?.deliveryAddress} style={utilSpacing.mb4}></Text>

              <Text tx="endOrderScreen.deliveryDate" caption preset="semiBold"></Text>

              <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
                <Text text={params.deliveryDate} style={utilSpacing.mr4}></Text>
                <Text text={params.deliverySlotTime}></Text>
              </View>

              <Text tx="orderDetailScreen.paymentMethod" caption preset="semiBold"></Text>
              <Text text={orderStore.orderDetail.paymentMethod} style={utilSpacing.mb4}></Text>

              <Text tx="orderDetailScreen.orderStatus" caption preset="semiBold"></Text>
              <Text text={orderStore.orderDetail.status} style={utilSpacing.mb4}></Text>

              {orderStore.orderDetail.paymentPending > 0 && (
                <View style={utilFlex.flex}>
                  <Text tx="orderDetailScreen.pending" caption preset="semiBold"></Text>
                  <Text
                    text={`${params.currencyCode} ${orderStore.orderDetail.paymentPending}`}
                  ></Text>
                </View>
              )}
            </Card>

            {/* <Card style={[utilSpacing.mb5, utilSpacing.px4, utilSpacing.py6]}>
              <Text tx="orderDetailScreen.orderStatus" caption preset="semiBold"></Text>
              <Text style={utilSpacing.pb5} text={params.status}></Text>
              <StateItem
                status="orderDetailScreen.waiting"
                isActive={params.woocommerceStatus === "wc-on-hold"}
              ></StateItem>
              <StateItem
                status="orderDetailScreen.processing"
                isActive={params.woocommerceStatus === "wc-processing"}
              ></StateItem>
              <StateItem
                status="orderDetailScreen.completed"
                isActive={
                  params.woocommerceStatus === "wc-completed" ||
                  params.woocommerceStatus === "wc-billing"
                }
                isHideLine
              ></StateItem>
            </Card> */}

            <Card style={[utilSpacing.mb5, utilSpacing.px4, utilSpacing.py6]}>
              {orderStore.orderDetail?.products.map((product, index) => (
                <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={index}>
                  <View style={utilSpacing.mr3}>
                    <Text text={`X ${product.quantity}`} numberOfLines={1} preset="semiBold"></Text>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text preset="bold" numberOfLines={2} text={product.name}></Text>
                    {product.metaData.map((item) => (
                      <View key={item.key} style={utilFlex.flexRow}>
                        <Text caption size="sm" text={`${item.key}:`}></Text>

                        <Text
                          numberOfLines={1}
                          style={utilSpacing.ml2}
                          caption
                          size="sm"
                          text={`${item.value}`}
                        ></Text>
                      </View>
                    ))}
                  </View>
                  <View style={utilSpacing.ml3}>
                    <Price
                      preset="simple"
                      amount={product.price}
                      currencyCode={params.currencyCode}
                    ></Price>
                  </View>
                </View>
              ))}
              <Separator style={styles.separator}></Separator>
              <View>
                <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
                  <Text
                    style={utilFlex.flex1}
                    preset="semiBold"
                    caption
                    tx="common.deliveryAmount"
                  ></Text>

                  {orderStore.orderDetail?.deliveryPrice > 0 ? (
                    <Price
                      preset="simple"
                      textStyle={utilText.bold}
                      amount={orderStore.orderDetail?.deliveryPrice}
                      currencyCode={params.currencyCode}
                    ></Price>
                  ) : (
                    <Text tx="common.free" style={utilText.semiBold}></Text>
                  )}
                </View>

                <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
                  <Text
                    style={utilFlex.flex1}
                    preset="semiBold"
                    caption
                    tx="common.subtotal"
                  ></Text>
                  <Price
                    preset="simple"
                    amount={params.total + (orderStore.orderDetail?.discount ?? 0)}
                    currencyCode={params.currencyCode}
                  ></Price>
                </View>

                {orderStore.orderDetail?.discount > 0 && (
                  <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
                    <Text
                      style={utilFlex.flex1}
                      preset="semiBold"
                      caption
                      tx="common.discount"
                    ></Text>
                    <Price
                      preset="simple"
                      amount={orderStore.orderDetail?.discount}
                      currencyCode={params.currencyCode}
                    ></Price>
                  </View>
                )}

                <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
                  <Text style={utilFlex.flex1} preset="bold" tx="common.total"></Text>
                  <Price
                    preset="simple"
                    textStyle={utilText.bold}
                    amount={params.total}
                    currencyCode={params.currencyCode}
                  ></Price>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  line: {
    backgroundColor: color.primary,
    height: 20,
    width: 2,
  },
  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
})
