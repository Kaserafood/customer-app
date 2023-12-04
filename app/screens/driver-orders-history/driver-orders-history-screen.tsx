import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useQuery } from "react-query"
import { Card, Header, Price, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { ModalStateHandler } from "../../utils/modalState"
import ModalCalendar from "./modal-calendar"
import ModalFilters from "./modal-filters"
import OrderItem from "./order-item"

const api = new Api()
const modalFilters = new ModalStateHandler()
const modalCalendar = new ModalStateHandler()

export const DriverOrdersHistoryScreen: FC<
  StackScreenProps<NavigatorParamList, "driverOrdersHistory">
> = observer(function DriverOrdersHistoryScreen({ navigation }) {
  const { userStore, commonStore, messagesStore } = useStores()
  const [selectedDate, setSelectedDate] = useState("")
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  })

  const { data, isFetched, refetch, isLoading } = useQuery(
    ["orders-driver-history", filters.startDate, filters.endDate],
    () =>
      api.getOrdersDriver(
        userStore.userId,
        RNLocalize.getTimeZone(),
        filters.startDate,
        filters.endDate,
        true,
      ),
    {
      enabled: true,
      onError: (error) => {
        console.log(error)
        messagesStore.showError()
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

  useEffect(() => {
    commonStore.setVisibleLoading(isLoading)
  }, [isLoading])

  const toDetail = (orderId: number, code?: string) => {
    navigation.navigate("driverOrderDetail", { id: orderId, code })
  }

  const handleFilter = (startDate: string, endDate: string) => {
    modalFilters.setVisible(false)
    setFilters({
      startDate,
      endDate,
    })
  }

  const getRevenue = useMemo(() => {
    let revenue = 0
    data?.data?.forEach((item) => {
      item.orders
        .filter((order) => order.status === "wc-completed" || order.status === "wc-billing")
        .forEach((order) => {
          revenue += +order.driverPayment || 0
        })
    })
    return revenue
  }, [data?.data])

  const countOrders = useMemo(() => {
    let count = 0
    data?.data?.forEach((item) => {
      count += item.orders.length
    })
    return count
  }, [data?.data])

  return (
    <Screen style={styles.container} preset="fixed">
      <Header
        headerTx="chefInvoiceScreen.title"
        leftIcon="back"
        onLeftPress={goBack}
        rightIcon="sliders"
        onRightPress={() => modalFilters.setVisible(true)}
      />
      <ScrollView>
        {data?.data?.length > 0 && (
          <Card style={[utilSpacing.m5, utilSpacing.p5]}>
            <View>
              <Text tx="common.summary" size="lg" preset="bold"></Text>
              <Text style={utilSpacing.pt3}>
                <Text
                  tx={
                    userStore.account?.isGeneralRegime ? "common.totalToInvoiced" : "common.revenue"
                  }
                  preset="bold"
                ></Text>
                <Text text=": " preset="bold"></Text>
                <Price amount={getRevenue} preset="simple" textStyle={utilText.regular}></Price>
              </Text>

              {userStore.account?.isGeneralRegime && (
                <Text style={utilSpacing.pt3}>
                  <Text tx="common.tax" preset="bold"></Text>
                  <Text text=": " preset="bold"></Text>
                  <Text text={userStore.account?.kaseraTaxId}></Text>
                </Text>
              )}

              <Text style={utilSpacing.py3}>
                <Text tx="common.orders" preset="bold"></Text>
                <Text text=": " preset="bold"></Text>
                <Text text={` ${countOrders}`}></Text>
              </Text>
            </View>
          </Card>
        )}

        <ListOrders data={data} toDetail={toDetail}></ListOrders>

        {isFetched && data?.data?.length === 0 && (
          <View style={utilSpacing.mt8}>
            <Text
              size="xl"
              style={utilFlex.selfCenter}
              preset="bold"
              tx="chefInvoiceScreen.noOrders"
            ></Text>
          </View>
        )}
      </ScrollView>

      <ModalFilters
        modalState={modalFilters}
        selectedDate={selectedDate}
        modalStateCalendar={modalCalendar}
        onFilter={handleFilter}
      ></ModalFilters>
      <ModalCalendar modalState={modalCalendar} onDayPress={setSelectedDate}></ModalCalendar>
    </Screen>
  )
})

interface Props {
  data: any
  toDetail: (orderId: number, code?: string) => void
}

const ListOrders = ({ data, toDetail }: Props) => {
  if (!data?.data) return null

  return (
    <View>
      {!!data &&
        data?.data?.map((item) => (
          <View key={item.date} style={[utilSpacing.mb3, utilSpacing.mx5]}>
            <View style={[utilFlex.flexRow, utilSpacing.py4]}>
              <Text tx="common.delivered" preset="bold" size="lg" style={utilSpacing.mr1}></Text>
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
                onPress={() => toDetail(order.id, order.code)}
              ></OrderItem>
            ))}
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.whiteGray,
  },
})
