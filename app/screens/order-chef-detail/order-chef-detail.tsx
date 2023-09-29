import { StackActions } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useMutation, useQuery } from "react-query"
import images from "../../assets/images"
import { Button, Card, Header, Image, Price, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getI18nText } from "../../utils/translate"

const api = new Api()

export const OrderChefDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "orderChefDetail">
> = observer(function OrderChefDetail({ navigation, route: { params } }) {
  const insets = useSafeAreaInsets()
  const { messagesStore, commonStore } = useStores()

  const { data: order } = useQuery(
    "order-detail",
    () => api.getOrderChefById(params.id, RNLocalize.getTimeZone()),
    {
      enabled: !!params.id,
      onError: (error) => {
        console.log(error)
      },
    },
  )

  const { mutate: confirm } = useMutation(() => api.updateOrderStatus(params.id, "confirmed"), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("ordersChefScreen.orderConfirmed", true)

        navigation.dispatch(
          StackActions.replace("ordersChef", {
            timestamp: new Date().getTime(),
          }),
        )
      } else messagesStore.showError("ordersChefScreen.orderConfirmedError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.orderConfirmedError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const { mutate: reject } = useMutation(() => api.updateOrderStatus(params.id, "rejected"), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("ordersChefScreen.orderRejected", true)
        navigation.dispatch(
          StackActions.replace("ordersChef", {
            timestamp: new Date().getTime(),
          }),
        )
      } else messagesStore.showError("ordersChefScreen.orderRejectedError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.orderRejectedError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const handleChangeStatus = async (callback) => {
    commonStore.setVisibleLoading(true)
    callback()
  }

  const { data } = order || {}

  return (
    <Screen preset="fixed">
      <Header
        headerText={getI18nText("orderChefDetail.title", { order: params.id })}
        leftIcon="back"
        onLeftPress={goBack}
      />
      {data && (
        <ScrollView style={styles.container}>
          <View style={[utilSpacing.px5, utilSpacing.pt5]}>
            <Text preset="bold" tx="common.delivery"></Text>
            <Text style={utilSpacing.mb5}>
              <Text
                text={data.deliveryDate}
                size="lg"
                style={utilText.textPrimary}
                preset="semiBold"
              ></Text>
              <Text preset="semiBold" size="lg" text={`, ${data.deliveryTime}`}></Text>
            </Text>
          </View>

          {data.products.map((product, index) => (
            <Product key={index} {...product}></Product>
          ))}

          {!!data.customerNote && (
            <Card style={[utilSpacing.my4, utilSpacing.mx5, utilSpacing.p4]}>
              <Text preset="semiBold" tx="orderChefDetail.customerNote"></Text>
              <Text text={data.customerNote}></Text>
            </Card>
          )}

          <Card style={[utilSpacing.my4, utilSpacing.mx5, utilSpacing.p4]}>
            <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
              <Text preset="bold" style={utilFlex.flex1} tx="common.articles"></Text>
              <Text text={`${data.products.length}`}></Text>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
              <Text preset="bold" style={utilFlex.flex1} tx="common.tax"></Text>
              <Text text={`${data.tax}`}></Text>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mb3]}>
              <Text preset="bold" style={utilFlex.flex1} tx="common.total"></Text>
              <Price
                amount={data.products.reduce((acc, item) => acc + +item.price, 0)}
                preset="simple"
              ></Price>
            </View>
          </Card>

          <Text
            caption
            text={getI18nText("orderChefDetail.orderMade", { date: data.createdDate })}
            style={[utilSpacing.p5, utilSpacing.pb7]}
          ></Text>
        </ScrollView>
      )}

      {data?.status === "pending-confirmation" && (
        <Card style={[styles.bordeTop, utilSpacing.px0]}>
          <View style={[utilFlex.flexRow, utilSpacing.px5]}>
            {/* <Button
              preset="gray"
              style={[utilSpacing.mr2, utilFlex.flex1, utilSpacing.px0]}
              tx="ordersChefScreen.reject"
              onPress={() => handleChangeStatus(reject)}
            ></Button> */}
            <Button
              preset="primary"
              style={[utilSpacing.ml2, utilFlex.flex1, utilSpacing.px0, styles.btnConfirm]}
              tx="ordersChefScreen.confirm"
              onPress={() => handleChangeStatus(confirm)}
            ></Button>
          </View>
          <View style={{ height: insets.bottom, backgroundColor: color.background }}></View>
        </Card>
      )}
    </Screen>
  )
})

interface ProductProps {
  name: string
  price: number
  quantity: number
  addons: {
    key: string
    value: string
  }[]
}

const Product = ({ name, price, addons, quantity }: ProductProps) => {
  const { userStore } = useStores()

  return (
    <Card style={[utilSpacing.mb5, utilSpacing.mx5, utilSpacing.p4]}>
      <View style={utilFlex.flexRow}>
        <Image source={images.bannerImage1} style={styles.imageProduct}></Image>
        <View style={utilSpacing.ml4}>
          <Text>
            <Text preset="bold" text={`x${quantity} - `}></Text>
            <Text preset="bold" text={name}></Text>
          </Text>

          <Price
            style={[styles.price, utilSpacing.mt4]}
            amount={+price}
            currencyCode={userStore.account?.currency}
          ></Price>
        </View>
      </View>
      {!!addons && addons.length > 0 && (
        <>
          <Text
            preset="semiBold"
            tx="orderChefDetail.customerPreferences"
            style={utilSpacing.py4}
          ></Text>
          {addons.map(({ key, value }) => (
            <View key={key} style={utilSpacing.mb2}>
              <Text text={`• ${key}`}></Text>
              <Text caption text={`   ${value}`}></Text>
            </View>
          ))}
        </>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  bordeTop: { borderTopColor: color.palette.grayLight, borderTopWidth: 1 },
  btnConfirm: {
    backgroundColor: palette.green,
  },
  container: {
    backgroundColor: palette.whiteGray,
  },
  imageProduct: {
    borderRadius: 8,
    height: 100,
    width: 140,
  },
  price: {
    alignSelf: "flex-start",
  },
})
