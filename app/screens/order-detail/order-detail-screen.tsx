import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { Card, CartItemAddon, Header, Icon, Price, Screen, Separator, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"

import { ScrollView } from "react-native-gesture-handler"
import { TxKeyPath } from "../../i18n"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

export const OrderDetailScreen: FC<StackScreenProps<NavigatorParamList, "orderDetail">> = observer(
  function OrderDetailScreen({ route: { params } }) {
    const { orderStore, commonStore } = useStores()
    useEffect(() => {
      async function fetch() {
        commonStore.setVisibleLoading(true)
        await orderStore.getDetail(params.id).finally(() => commonStore.setVisibleLoading(false))
      }
      fetch()
    }, [])

    return (
      <Screen preset="fixed" style={{ backgroundColor: color.palette.whiteGray }}>
        <Header headerTx="orderDetailScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <View style={utilSpacing.px5}>
            <Card style={[utilSpacing.my5, utilSpacing.px4, utilSpacing.py6]}>
              <View style={utilFlex.flexRow}>
                <Text tx="orderDetailScreen.order" size="lg" preset="bold"></Text>
                <Text text={` #${params.id}`} size="lg" preset="bold"></Text>
              </View>

              <Text tx="endOrderScreen.deliveryOn" caption preset="semiBold"></Text>
              <Text text={orderStore.orderDetail.deliveryAddress} style={utilSpacing.mb4}></Text>

              <Text tx="endOrderScreen.deliveryDate" caption preset="semiBold"></Text>
              <Text
                text={`${params.deliveryDate} ${params.deliverySlotTime}`}
                style={utilSpacing.mb4}
              ></Text>

              <Text tx="orderDetailScreen.paymentMethod" caption preset="semiBold"></Text>
              <Text text={orderStore.orderDetail.paymentMethod}></Text>
              {orderStore.orderDetail.paymentPending > 0 && (
                <View style={utilFlex.flex}>
                  <Text tx="orderDetailScreen.pending" caption preset="semiBold"></Text>
                  <Text text={params.currencyCode + orderStore.orderDetail.paymentPending}></Text>
                </View>
              )}
            </Card>

            <Card style={[utilSpacing.mb5, utilSpacing.px4, utilSpacing.py6]}>
              <Text tx="orderDetailScreen.orderStatus" caption preset="semiBold"></Text>
              <Text style={utilSpacing.pb5} text={params.status}></Text>
              <StateItem status="orderDetailScreen.waiting"></StateItem>
              <StateItem status="orderDetailScreen.processing" isActive={true}></StateItem>
              <StateItem status="orderDetailScreen.completed" isHideLine></StateItem>
            </Card>

            <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
              {orderStore.orderDetail.products.map((product, index) => (
                <View style={[utilFlex.flexRow, utilSpacing.mb5]} key={index}>
                  <View style={utilSpacing.mr3}>
                    <Text text={`X ${product.quantity}`} numberOfLines={1} preset="semiBold"></Text>
                  </View>
                  <View style={utilFlex.flex1}>
                    <Text preset="bold" numberOfLines={2} text={product.name}></Text>
                    <CartItemAddon metaDataCart={product.metaData}></CartItemAddon>
                  </View>
                  <View style={utilSpacing.ml3}>
                    <Price
                      preset="simple"
                      amount={params.total}
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
                    tx="common.subtotal"
                  ></Text>
                  <Price
                    preset="simple"
                    amount={params.total - orderStore.orderDetail.deliveryPrice}
                    currencyCode={params.currencyCode}
                  ></Price>
                </View>

                <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
                  <Text
                    style={utilFlex.flex1}
                    preset="semiBold"
                    caption
                    tx="common.deliveryAmount"
                  ></Text>
                  <Price
                    preset="simple"
                    amount={orderStore.orderDetail.deliveryPrice}
                    currencyCode={params.currencyCode}
                  ></Price>
                </View>

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

const StateItem = (params: { status: TxKeyPath; isActive?: boolean; isHideLine?: boolean }) => {
  const { status, isActive, isHideLine } = params
  return (
    <View style={utilFlex.flexRow}>
      <View style={utilFlex.felxColumn}>
        <Icon
          style={utilFlex.selfCenter}
          name={isActive ? "heart" : "heart1"}
          color={color.primary}
          size={30}
        ></Icon>
        {!isHideLine && <View style={[styles.line, utilFlex.selfCenter]}></View>}
      </View>
      <Text preset="bold" style={[utilSpacing.mt3, utilSpacing.ml4]} tx={status}></Text>
    </View>
  )
}

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
