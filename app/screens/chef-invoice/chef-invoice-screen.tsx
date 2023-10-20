import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
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
import { ModalStateHandler } from "../../utils/modalState"
import ModalUploadInvoice from "./modal-upload-invoice"
import OrderItem from "./order-item"

const api = new Api()
const modalStateInvoice = new ModalStateHandler()

export const ChefInvoiceScreen: FC<StackScreenProps<NavigatorParamList, "ordersChef">> = observer(
  function ChefInvoiceScreen({ navigation, route: { params } }) {
    const { userStore, commonStore } = useStores()
    const [currentOrder, setCurrentOrder] = useState({
      orderId: 0,
      code: "",
    })

    const { data, isFetched, refetch, isLoading } = useQuery(
      "orders",
      () => api.getOrdersChef(userStore.userId, RNLocalize.getTimeZone(), true),
      {
        onError: (error) => {
          console.log(error)
        },
        onSettled: () => {
          commonStore.setVisibleLoading(false)
        },
      },
    )

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

    return (
      <Screen style={styles.container} preset="fixed">
        <Header headerTx="chefInvoiceScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView>
        { !!data && (
          <ListOrders
          refetch={refetch}
          data={data}
          toDetail={toDetail}
          handleUpload={handleOnUpload}
        ></ListOrders>
        ) }
          

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
        <ModalUploadInvoice
          modalState={modalStateInvoice}
          orderId={currentOrder.orderId}
          code={currentOrder.code}
          onUploaded={handleUploaded}
        ></ModalUploadInvoice>
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
  return (
    <View>
      {!!data && data?.data?.map((item) => (
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
