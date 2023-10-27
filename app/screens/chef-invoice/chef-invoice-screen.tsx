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
import ModalUploadInvoice from "./modal-upload-invoice"
import OrderItem from "./order-item"

const api = new Api()
const modalStateInvoice = new ModalStateHandler()
const modalFilters = new ModalStateHandler()
const modalCalendar = new ModalStateHandler()

export const ChefInvoiceScreen: FC<StackScreenProps<NavigatorParamList, "ordersChef">> = observer(
  function ChefInvoiceScreen({ navigation, route: { params } }) {
    const { userStore, commonStore, messagesStore } = useStores()
    const [selectedDate, setSelectedDate] = useState("")
    const [filters, setFilters] = useState({
      startDate: "",
      endDate: "",
      typeOrder: [],
    })
    const [currentOrder, setCurrentOrder] = useState({
      orderId: 0,
      code: "",
    })

    const { data, isFetched, refetch, isLoading } = useQuery(
      ["orders", filters.startDate, filters.endDate, filters.typeOrder],
      () =>
        api.getOrdersChef({
          chefId: userStore.userId,
          timeZone: RNLocalize.getTimeZone(),
          toUploadInvoice: true,
          startDate: filters.startDate,
          endDate: filters.endDate,
          typeOrder: filters.typeOrder,
        }),
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
      navigation.navigate("orderChefDetail", { id: orderId, code })
    }

    const handleOnUpload = (orderId: number, code?: string) => {
      setCurrentOrder({
        orderId,
        code,
      })
      modalStateInvoice.setVisible(true)
    }
    const handleUploaded = () => {
      modalStateInvoice.setVisible(false)
      refetch()
    }

    const handleFilter = (startDate: string, endDate: string, typeOrder: string[]) => {
      modalFilters.setVisible(false)
      setFilters({
        startDate,
        endDate,
        typeOrder,
      })
    }

    const getRevenue = useMemo(() => {
      let revenue = 0
      data?.data?.forEach((item) => {
        item.orders.forEach((order) => {
          revenue += +order.revenue || 0
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
                      userStore.account?.isGeneralRegime
                        ? "common.totalToInvoiced"
                        : "common.revenue"
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

          <ListOrders
            refetch={refetch}
            data={data}
            toDetail={toDetail}
            handleUpload={handleOnUpload}
          ></ListOrders>

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
        <ModalUploadInvoice
          modalState={modalStateInvoice}
          orderId={currentOrder.orderId}
          code={currentOrder.code}
          onUploaded={handleUploaded}
        ></ModalUploadInvoice>
        <ModalFilters
          modalState={modalFilters}
          selectedDate={selectedDate}
          modalStateCalendar={modalCalendar}
          onFilter={handleFilter}
        ></ModalFilters>
        <ModalCalendar modalState={modalCalendar} onDayPress={setSelectedDate}></ModalCalendar>
      </Screen>
    )
  },
)

interface Props {
  data: any
  toDetail: (orderId: number, code?: string) => void
  handleUpload: (orderId: number, code?: string) => void
  refetch: () => void
}

const ListOrders = ({ data, toDetail, handleUpload, refetch }: Props) => {
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
                refetch={refetch}
                onPress={() => toDetail(order.id, order.code)}
                onUpload={() => handleUpload(order.id, order.code)}
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
