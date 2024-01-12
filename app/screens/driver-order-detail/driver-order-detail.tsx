import { StackActions } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useMutation, useQuery } from "react-query"

import {
  Button,
  ButtonFooter,
  Card,
  Header,
  Icon,
  Image,
  Price,
  Screen,
  Separator,
  Text,
} from "../../components"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { NavigatorParamList, goBack } from "../../navigators"
import { Api } from "../../services/api"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { ModalStateHandler } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"
import ModalNotDeliver from "./modal-not-deliver"

const api = new Api()
const modalStateNotDeliver = new ModalStateHandler()

export const DriverOrderDetail: FC<
  StackScreenProps<NavigatorParamList, "driverOrderDetail">
> = observer(function OrderChefDetail({ navigation, route: { params } }) {
  const { messagesStore, commonStore } = useStores()
  const [code, setCode] = useState(params.code)
  const [codeCredit, setCodeCredit] = useState("")

  const { data: order, isLoading } = useQuery(
    ["order-detail", params.id],
    () => api.getDriverOrderById(params.id, RNLocalize.getTimeZone()),
    {
      enabled: !!params.id,
      onSuccess(data) {
        const order = data.data

        if (order) {
          const { code, codeCredit } = order
          if (code) {
            setCode(code)
          }

          if (codeCredit) {
            setCodeCredit(codeCredit)
          }
        }
      },
      onError: (error) => {
        console.log(error)
        messagesStore.showError()
      },
    },
  )

  useEffect(() => {
    commonStore.setVisibleLoading(isLoading)
  }, [isLoading])

  const { mutate: confirm } = useMutation(() => api.driverConfirmed([params.id]), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("driverOrderDetailScreen.confirmedOrder", true)

        navigation.dispatch(
          StackActions.replace("driverOrders", {
            timestamp: new Date().getTime(),
          }),
        )
      } else messagesStore.showError("ordersChefScreen.confirmedOrderError", true)
    },

    onError: () => {
      messagesStore.showError("ordersChefScreen.confirmedOrderError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const { mutate: complete } = useMutation(() => api.updateOrderStatus(params.id, "wc-completed"), {
    onSuccess: (data) => {
      if (data.data?.value) {
        messagesStore.showSuccess("driverOrderDetailScreen.completedOrder", true)

        navigation.dispatch(
          StackActions.replace("driverOrders", {
            timestamp: new Date().getTime(),
          }),
        )
      } else messagesStore.showError("driverOrderDetailScreen.completedOrderError", true)
    },

    onError: () => {
      messagesStore.showError("driverOrderDetailScreen.completedOrderError", true)
    },
    onSettled: () => {
      commonStore.setVisibleLoading(false)
    },
  })

  const handleChangeStatus = async (callback) => {
    commonStore.setVisibleLoading(true)
    callback()
  }

  const handleOnCancel = () => {
    navigation.navigate("driverOrders", { timestamp: new Date().getTime().toString() })
  }

  const { data } = order || {}

  const showButtonComplete = useMemo(
    () =>
      !!data &&
      data.isToday &&
      data.driverConfirmed &&
      data.status !== "wc-completed" &&
      data.status !== "wc-billing" &&
      !data.driverCanceled,
    [data],
  )

  return (
    <Screen preset="fixed">
      <Header
        headerText={getI18nText("orderChefDetail.title", {
          order: code || codeCredit || params.id,
        })}
        leftIcon="back"
        onLeftPress={goBack}
      />
      {data && (
        <ScrollView style={styles.container}>
          <View style={[utilSpacing.px5, utilSpacing.pt5]}>
            <Text preset="bold" tx="common.delivery"></Text>
            <Text>
              <Text
                text={data.deliveryDate}
                size="lg"
                style={utilText.textPrimary}
                preset="semiBold"
              ></Text>
              <Text preset="semiBold" size="lg" text={`, ${data.deliveryTime}`}></Text>
            </Text>
          </View>

          <View>
            <View style={[utilSpacing.mx5, utilSpacing.mt3]}>
              <Separator style={utilSpacing.my3}></Separator>
            </View>

            <Text
              preset="semiBold"
              style={[utilSpacing.px5, utilSpacing.mt3]}
              tx="driverOrderDetailScreen.pickUp"
            ></Text>

            <Card style={[utilSpacing.mx5, utilSpacing.my4, utilSpacing.p4]}>
              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.address"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.chefAddress}></Text>
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.phone"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.chefPhone}></Text>
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.name"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.chefName}></Text>
              </Text>
            </Card>

            <Text
              preset="semiBold"
              style={[utilSpacing.px5, utilSpacing.mt3]}
              tx="driverOrderDetailScreen.deliver"
            ></Text>

            <Card style={[utilSpacing.mx5, utilSpacing.my4, utilSpacing.p4]}>
              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.address"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.customerAddress}></Text>
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.phone"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.customerPhone}></Text>
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.name"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.customerName}></Text>
              </Text>

              {!!data.customerNote && (
                <Text style={utilSpacing.mb2}>
                  <Text preset="semiBold" tx="driverOrderDetailScreen.customerNote"></Text>
                  <Text text=": " preset="semiBold"></Text>
                  <Text text={data.customerNote}></Text>
                </Text>
              )}
            </Card>

            <Card style={[utilSpacing.my2, utilSpacing.mx5, utilSpacing.p4]}>
              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="orderChefDetail.revenue"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Price
                  amount={data.driverPayment}
                  preset="simple"
                  textStyle={utilText.regular}
                ></Price>
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.paymentMethod"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.paymentMethod}></Text>
              </Text>

              <Text style={[utilSpacing.mb2, utilFlex.flexRow]}>
                <Text preset="semiBold" tx="driverOrderDetailScreen.paidByCustomer"></Text>
                <Text preset="semiBold" text=": "></Text>
                {data.paidByCustomer ? (
                  <Text tx="common.yes" style={utilSpacing.mr2}></Text>
                ) : (
                  <Text tx="common.no" style={utilSpacing.mr3}></Text>
                )}
              </Text>

              <Text style={utilSpacing.mb2}>
                <Text preset="semiBold" tx="common.status"></Text>
                <Text preset="semiBold" text=": "></Text>
                <Text text={data.statusName}></Text>
              </Text>

              {!!data.driverCash && (
                <Text style={[utilSpacing.mb2, utilSpacing.p3, styles.bgBlue]}>
                  <Text preset="semiBold" tx="driverOrderDetailScreen.pendingPayment"></Text>
                  <Text text=": " preset="semiBold"></Text>
                  <Price
                    preset="simple"
                    textStyle={[utilText.semiBold]}
                    amount={data.driverCash}
                  ></Price>
                </Text>
              )}
            </Card>
          </View>

          <Separator style={[utilSpacing.mx5, utilSpacing.my6]}></Separator>

          <Text
            preset="semiBold"
            text={translate("common.dishes")}
            style={[utilSpacing.mx5, utilSpacing.mb4]}
          ></Text>

          {code ? (
            <Card style={[utilSpacing.mx5, utilSpacing.p4, utilSpacing.mb5]}>
              <Text size="lg" tx="common.dishes" preset="semiBold" style={utilSpacing.mb3}></Text>
              <View>
                {data.package?.packages[0].dishes.map((dish) => (
                  <View key={dish.id} style={utilSpacing.mb4}>
                    <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                      <Icon
                        name="check-1"
                        size={10}
                        color={color.text}
                        style={utilSpacing.pr2}
                      ></Icon>
                      <Text>
                        <Text text={`X ${dish.quantity} - ${dish.name}`} preset="semiBold"></Text>
                        <Text text=" "></Text>
                        <Text text={dish.accompaniments.split("||").join(",")}></Text>
                      </Text>
                    </View>
                    {dish.comment && (
                      <Text
                        style={[styles.comment, utilSpacing.px3, utilSpacing.py2, utilSpacing.mt2]}
                      >
                        <Text preset="semiBold" tx="common.comment"></Text>
                        <Text text=": "></Text>
                        <Text text={dish.comment}></Text>
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </Card>
          ) : (
            <View>
              {data.products.map((product, index) => (
                <Product key={index} {...product} showPrice={!codeCredit}></Product>
              ))}
            </View>
          )}

          {showButtonComplete && (
            <Button
              preset="gray"
              style={[utilFlex.selfCenter, utilSpacing.my4]}
              tx="driverOrderDetailScreen.notDeliver"
              iconLeft={<Icon name="circle-xmark" color={palette.black}></Icon>}
              onPress={() => modalStateNotDeliver.setVisible(true)}
            ></Button>
          )}
        </ScrollView>
      )}
      {showButtonComplete && (
        <ButtonFooter
          tx="driverOrderDetailScreen.slideConfirm"
          onPress={() => handleChangeStatus(complete)}
          slideToAction
        ></ButtonFooter>
      )}

      {!!data && !data.driverConfirmed && (
        <ButtonFooter
          tx="common.confirm"
          onPress={() => handleChangeStatus(confirm)}
        ></ButtonFooter>
      )}

      {data?.id && (
        <ModalNotDeliver
          modalState={modalStateNotDeliver}
          orderId={data.id}
          onCancel={handleOnCancel}
        ></ModalNotDeliver>
      )}
    </Screen>
  )
})

interface ProductProps {
  name: string
  price: number
  quantity: number
  image: string
  noteChef?: string
  showPrice?: boolean
  description?: string
  addons: {
    key: string
    value: string
  }[]
}

const Product = ({ name, addons, quantity, image, description }: ProductProps) => {
  return (
    <Card style={[utilSpacing.mb5, utilSpacing.mx5, utilSpacing.p4]}>
      <View style={utilFlex.flexRow}>
        <Image source={{ uri: image }} style={styles.imageProduct}></Image>
        <View style={[utilSpacing.ml4, utilFlex.flex1]}>
          <Text>
            <Text preset="bold" text={`x${quantity} - `}></Text>
            <Text preset="bold" text={name}></Text>
          </Text>
          {description && <Text text={description}></Text>}
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
  bgBlue: {
    backgroundColor: palette.amber50,
    borderColor: palette.amber600,
    borderRadius: spacing[2],
    borderWidth: 1,
  },
  comment: {
    backgroundColor: palette.whiteGray,
    borderRadius: spacing[2],
    width: "auto",
  },

  container: {
    backgroundColor: palette.whiteGray,
  },
  imageProduct: {
    borderRadius: 8,
    height: 100,
    width: 140,
  },
})
