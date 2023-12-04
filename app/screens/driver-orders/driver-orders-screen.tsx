import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useMutation, useQuery } from "react-query"
import { ButtonFooter, Header, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import OrderItem from "./order-item"

const api = new Api()
export const DriverOrdersScreen: FC<
  StackScreenProps<NavigatorParamList, "driverOrders">
> = observer(function DriverOrdersScreen({ navigation, route: { params } }) {
  const { userStore, commonStore, messagesStore } = useStores()

  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  useEffect(() => {
    if (params?.timestamp) {
      refetch()
    }
  }, [params?.timestamp])

  const { data, isFetched, refetch } = useQuery(
    "orders-driver",
    () => api.getOrdersDriver(userStore.userId, RNLocalize.getTimeZone()),
    {
      enabled: false,
      onError: (error) => {
        console.log(error)
        messagesStore.showError()
      },
      onSettled: () => {
        commonStore.setVisibleLoading(false)
      },
    },
  )

  const { mutate: confirm } = useMutation(() => api.driverConfirmed(selectedOrders), {
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

  useEffect(() => {
    commonStore.setVisibleLoading(true)
    refetch()
  }, [])

  const toDetail = (orderId: number, code?: string) => {
    navigation.navigate("driverOrderDetail", { id: orderId, code })
  }

  const handleCheck = (selected: boolean, id: number) => {
    if (selected) {
      setSelectedOrders([...selectedOrders, id])
    } else {
      setSelectedOrders(selectedOrders.filter((item) => item !== id))
    }
  }

  return (
    <Screen style={styles.container} preset="fixed">
      <Header headerTx="driverOrdersScreen.title" leftIcon="back" onLeftPress={goBack} />
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
                onCheck={(selected) => handleCheck(selected, order.id)}
                isSelected={selectedOrders.some((item) => +item === +order.id)}
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
              tx="driverOrdersScreen.noOrders"
            ></Text>
          </View>
        )}
      </ScrollView>

      {selectedOrders.length > 0 && (
        <ButtonFooter tx="driverOrdersScreen.confirm" onPress={() => confirm}></ButtonFooter>
      )}
    </Screen>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.whiteGray,
  },
})
