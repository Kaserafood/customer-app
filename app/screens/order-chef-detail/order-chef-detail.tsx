import { StackActions } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import * as RNLocalize from "react-native-localize"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useMutation, useQuery } from "react-query"
import {
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
import { getI18nText } from "../../utils/translate"

const api = new Api()

export const OrderChefDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "orderChefDetail">
> = observer(function OrderChefDetail({ navigation, route: { params } }) {
  const insets = useSafeAreaInsets()
  const { messagesStore, commonStore } = useStores()
  const [code, setCode] = useState(params.code)
  const [codeCredit, setCodeCredit] = useState("")

  const { data: order, isLoading } = useQuery(
    ["order-detail", params.id],
    () => api.getOrderChefById(params.id, RNLocalize.getTimeZone()),
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
      },
    },
  )

  useEffect(() => {
    commonStore.setVisibleLoading(isLoading)
  }, [isLoading])

  const { mutate: confirm } = useMutation(() => api.updateOrderStatus(params.id, "wc-confirmed"), {
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

          {!!code && (
            <View
              style={[
                styles.tag,
                utilSpacing.px5,
                utilSpacing.py2,
                utilSpacing.mt4,
                utilSpacing.ml5,
              ]}
            >
              <Text
                tx="orderChefDetail.vacuumPacked"
                preset="semiBold"
                size="lg"
                style={styles.amber}
              ></Text>
            </View>
          )}

          {!codeCredit && (
            <View>
              <View style={[utilSpacing.mx5, utilSpacing.mt3]}>
                <Separator style={utilSpacing.my3}></Separator>
                <Text preset="semiBold" text={translate("orderChefDetail.orderSummary")}></Text>
              </View>

              <Card style={[utilSpacing.m5, utilSpacing.p4]}>
                <View>
                  {data.products.map((product, index) => (
                    <View key={product.itemId} style={utilSpacing.mb2}>
                      <Text>
                        <Text preset="bold" text={`X${product.quantity} - `}></Text>
                        <Text text={product.name}></Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              {!!code && !!data.noteChef && (
                <Card style={[utilSpacing.mx5, utilSpacing.mb5, utilSpacing.p4]}>
                  <Text>
                    <Text preset="semiBold" tx="orderChefDetail.noteChef"></Text>
                    <Text text=": "></Text>
                    <Text text={data.noteChef}></Text>
                  </Text>
                </Card>
              )}

              <Card style={[utilSpacing.mx5, utilSpacing.p4]}>
                <Text style={utilSpacing.mb2}>
                  <Text preset="semiBold" tx="orderChefDetail.amountInvoice"></Text>
                  <Price
                    amount={data.totalInvoice}
                    preset="simple"
                    textStyle={utilText.regular}
                  ></Price>
                </Text>
                <Text>
                  <Text preset="bold" style={utilFlex.flex1} tx="orderChefDetail.tax"></Text>
                  <Text text={`${data.tax}`}></Text>
                </Text>
              </Card>
            </View>
          )}

          <Separator style={[utilSpacing.mx5, utilSpacing.my6]}></Separator>

          <Text
            preset="semiBold"
            text={translate("orderChefDetail.detailedOrder")}
            style={[utilSpacing.mx5, utilSpacing.mb4]}
          ></Text>

          {code ? (
            <Card style={[utilSpacing.mx5, utilSpacing.p4, utilSpacing.mb5]}>
              <Text size="lg" tx="common.dishes" preset="semiBold" style={utilSpacing.mb3}></Text>
              <View>
                {data.package?.packages[0].dishes.map((dish, index) => (
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

          {!!codeCredit && !!data.noteChef && data.noteChef !== "null" && (
            <Card style={[utilSpacing.mx5, utilSpacing.mb5, utilSpacing.p4]}>
              <Text>
                <Text preset="semiBold" tx="orderChefDetail.noteChef"></Text>
                <Text text=": "></Text>
                <Text text={data.noteChef}></Text>
              </Text>
            </Card>
          )}

          <Card style={[utilSpacing.my2, utilSpacing.mx5, utilSpacing.p4]}>
            <View style={utilFlex.flexRow}>
              <Text preset="semiBold" tx="orderChefDetail.revenue"></Text>
              <Price amount={data.revenue} preset="simple" textStyle={utilText.regular}></Price>

              {!code && (
                <>
                  <Text text={` ( ${data.products.length} `}></Text>
                  <Text
                    tx={
                      data.products.length === 1
                        ? "orderChefDetail.article"
                        : "orderChefDetail.articles"
                    }
                  ></Text>
                  <Text text=" )"></Text>
                </>
              )}
            </View>
          </Card>

          <Text
            caption
            text={getI18nText("orderChefDetail.orderMade", { date: data.createdDate })}
            style={[utilSpacing.p5, utilSpacing.pb7]}
          ></Text>
        </ScrollView>
      )}

      {data?.status === "wc-pending-confirmation" && (
        <ButtonFooter
          tx="ordersChefScreen.confirm"
          onPress={() => handleChangeStatus(confirm)}
        ></ButtonFooter>
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

const Product = ({
  name,
  price,
  addons,
  quantity,
  image,
  noteChef,
  showPrice = true,
  description,
}: ProductProps) => {
  const { userStore } = useStores()

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

          {showPrice && (
            <Price
              style={[styles.price, utilSpacing.mt4]}
              amount={+price}
              currencyCode={userStore.account?.currency}
            ></Price>
          )}
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

      {!!noteChef && noteChef !== "null" && (
        <>
          <Text preset="semiBold" tx="orderChefDetail.noteChef" style={utilSpacing.pt4}></Text>
          <Text text={noteChef}></Text>
        </>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  amber: {
    color: palette.blue,
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
  price: {
    alignSelf: "flex-start",
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: palette.blueBg,
    borderRadius: 8,
  },
})
