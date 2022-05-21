import { StackScreenProps } from "@react-navigation/stack"
import images from "assets/images"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import SvgUri from "react-native-svg-uri"
import {
  Card,
  Checkbox,
  Header,
  InputTextCard,
  Price,
  Screen,
  Separator,
  Text,
} from "../../components"
import { AutoImage } from "../../components/auto-image/auto-image"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const DeliveryDetailScreen: FC<
  StackScreenProps<NavigatorParamList, "deliveryDetail">
> = observer(({ navigation }) => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const toEndOrder = () => navigation.navigate("endOrder")

  useEffect(() => {
    console.log("delviery dtail effect")
  }, [])

  return (
    <Screen style={ROOT} preset="scroll">
      <Header headerTx="deliveryDetailScreen.title" leftIcon="back" onLeftPress={goBack} />
      <ScrollView style={utilSpacing.m2}>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.info"
          style={[utilSpacing.mb5, utilSpacing.mt6, utilSpacing.mx4]}
        ></Text>
        <InputTextCard
          titleTx="deliveryDetailScreen.address"
          placeholderTx="deliveryDetailScreen.addressPlaceholder"
          style={[utilSpacing.mb6, utilSpacing.mx4]}
        ></InputTextCard>
        <InputTextCard
          titleTx="deliveryDetailScreen.deliveryNote"
          style={utilSpacing.mx4}
          placeholderTx="deliveryDetailScreen.deliveryNotePlaceholder"
        ></InputTextCard>
        <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
        <InputTextCard
          titleTx="deliveryDetailScreen.deliveryDate"
          placeholderTx="deliveryDetailScreen.deliveryDatePlaceholder"
          style={[utilSpacing.mb6, utilSpacing.mx4]}
        ></InputTextCard>
        <Text
          preset="bold"
          style={[utilSpacing.mx4, utilSpacing.mb4]}
          tx="deliveryDetailScreen.deliveryTime"
        ></Text>
        <Card style={[utilSpacing.mb3, utilSpacing.mx4]}>
          <Checkbox rounded value={true} preset="tiny" text="12pm a 3pm"></Checkbox>
        </Card>
        <Card style={[utilSpacing.mb3, utilSpacing.mx4]}>
          <Checkbox style={utilSpacing.px3} rounded preset="tiny" text="4pm a 6pm"></Checkbox>
        </Card>
        <Card style={[utilSpacing.mb3, utilSpacing.mx4]}>
          <Checkbox rounded preset="tiny" text="12pm a 3pm"></Checkbox>
        </Card>
        <Separator style={[utilSpacing.my6, utilSpacing.mx4]}></Separator>
        <Text
          preset="bold"
          tx="deliveryDetailScreen.paymentMethod"
          style={[utilSpacing.mb4, utilSpacing.mx4]}
        ></Text>
        <Card style={utilSpacing.mx4}>
          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <AutoImage style={utilSpacing.mr4} source={images.card}></AutoImage>
            <Text style={utilFlex.flex1} text="*****234324" preset="bold"></Text>
            <SvgUri height={16} width={16} source={images.caretRight}></SvgUri>
          </View>
        </Card>
        <View style={utilSpacing.mx4}>
          <Separator style={utilSpacing.my6}></Separator>
          <Text preset="semiBold" tx="deliveryDetailScreen.delivery" caption></Text>
          <Text
            preset="semiBold"
            caption
            text="Martes 13 de mayo, 12pm a 3pm"
            style={utilSpacing.mb6}
          ></Text>
          <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <View style={utilSpacing.mr3}>
                <Text text="X1" preset="semiBold"></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text preset="bold" text="Enchiladas verdes"></Text>
                <Text size="sm" text="Cardne pollo" caption style={utilText.textGray}></Text>
              </View>
              <View style={utilSpacing.ml3}>
                <Price style={styles.price} amount={40}></Price>
              </View>
            </View>
            <View style={[utilFlex.flexRow, utilSpacing.mb4]}>
              <View style={utilSpacing.mr3}>
                <Text text="X1" preset="semiBold"></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text preset="bold" text="Enchiladas verdes"></Text>
                <Text size="sm" text="Carne pollo" caption style={utilText.textGray}></Text>
              </View>
              <View style={utilSpacing.ml3}>
                <Price style={styles.price} amount={40}></Price>
              </View>
            </View>
            <Separator style={styles.separator}></Separator>
            <View style={utilFlex.flexRow}>
              <Text style={utilFlex.flex1} preset="bold" tx="common.subtotal"></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View style={utilFlex.flexRow}>
              <Text
                style={[utilFlex.flex1, utilSpacing.ml3]}
                preset="semiBold"
                caption
                tx="common.deliveryAmount"
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>

            <Separator style={styles.separator}></Separator>

            <View style={utilFlex.flexRow}>
              <Text preset="bold" tx="common.total"></Text>
              <Price style={styles.price} amount={300}></Price>
            </View>
          </Card>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={toEndOrder}
        activeOpacity={0.7}
        style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
      >
        <Text
          preset="bold"
          style={[styles.textAddToOrder, utilSpacing.mx3]}
          tx="dishDetailScreen.addToOrder"
        ></Text>
        <Text preset="bold" style={styles.textAddToOrder} text={`${40}`}></Text>
      </TouchableOpacity>
    </Screen>
  )
})

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  price: {
    backgroundColor: color.background,
  },
  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
})
