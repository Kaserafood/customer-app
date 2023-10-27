import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useQuery } from "react-query"
import { Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import OrderItem from "./order-item"

const api = new Api()
export const OrdersChefScreen: FC<StackScreenProps<NavigatorParamList, "ordersChef">> = observer(
  function OrdersPrepare({ navigation, route: { params } }) {
    const { userStore, commonStore } = useStores()

    useEffect(() => {
      if (params?.timestamp) {
        refetch()
      }
    }, [params?.timestamp])

    const { data, isFetched, refetch, isLoading } = useQuery(
      "orders",
      () =>
        api.getOrdersChef({
          chefId: userStore.userId,
          timeZone: RNLocalize.getTimeZone(),
        }),
      {
        enabled: false,
        onError: (error) => {
          console.log(error)
        },
        onSettled: () => {
          commonStore.setVisibleLoading(false)
        },
      },
    )

    useEffect(() => {
      commonStore.setVisibleLoading(true)
      refetch()
    }, [])

    const toDetail = (orderId: number, code?: string) => {
      navigation.navigate("orderChefDetail", { id: orderId, code })
    }

    return (
      <Screen style={styles.container} preset="fixed">
        <Header headerTx="ordersChefScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView>
          {data?.data?.map((item) => (
            <View key={item.date} style={[utilSpacing.mb3, utilSpacing.mx5]}>
              <View style={[utilFlex.flexRow, utilSpacing.py4]}>
                <Text tx="common.delivery" preset="bold" size="lg" style={utilSpacing.mr1}></Text>
                <Text text=" "></Text>
                <Text
                  text={item.dateName}
                  preset="bold"
                  size="lg"
                  style={(item.isToday || item.isTomorrow) && utilText.textPrimary}
                ></Text>
              </View>

              {item.orders.map((order) => (
                <OrderItem
                  {...order}
                  key={order.id}
                  border={item.isToday}
                  isToday={item.isToday}
                  refetch={refetch}
                  onPress={() => toDetail(order.id, order.code)}
                ></OrderItem>
              ))}
            </View>
          ))}

          {isFetched && data?.data?.length === 0 && (
            <View style={utilSpacing.mt8}>
              <Text
                size="xl"
                style={utilFlex.selfCenter}
                preset="bold"
                tx="ordersChefScreen.noOrders"
              ></Text>
            </View>
          )}
        </ScrollView>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.whiteGray,
  },
})
