import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ScrollView, StyleSheet, View, StyleProp } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import {
  AutoImage,
  Button,
  Complements,
  DishChef,
  Header,
  InputTextCard,
  Price,
  Screen,
  Text,
} from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import images from "assets/images"
import { spacing } from "../../theme/spacing"
import { Separator } from "../../components/separator/separator"
import { utilSpacing, utilFlex, utilText, SHADOW } from "../../theme/Util"
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler"
import SvgUri from "react-native-svg-uri"
import Ripple from "react-native-material-ripple"
import { typographySize } from "../../theme/typography"

export const DishDetailScreen: FC<StackScreenProps<NavigatorParamList, "dishDetail">> = observer(
  function DishDetailScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [price, setPrice] = useState("Q50.4")
    const [counter, setCounter] = useState(1)

    return (
      <Screen preset="fixed" style={styles.container}>
        <Header headerTx="dishDetailScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView style={utilSpacing.p4}>
          <AutoImage style={styles.image} source={images.dish3}></AutoImage>
          <View style={[utilFlex.flexRow, utilSpacing.my3, utilSpacing.mx4]}>
            <Text style={utilSpacing.mr3} text="Enchiladas verdes" preset="bold"></Text>
            <Price amount={40}></Price>
          </View>
          <Text
            style={[utilSpacing.mb2, utilSpacing.mx4]}
            text="Cuatro enchiladas con salsa verde, queso y ceboola de arriba 1/2 kg"
          ></Text>
          <Separator style={utilSpacing.my3}></Separator>
          <Complements></Complements>
          <View style={utilFlex.flexCenter}>
            <View style={styles.containerUnities}>
              <Text
                style={[styles.textUnities, utilSpacing.p3]}
                tx="dishDetailScreen.unities"
                preset="bold"
              ></Text>

              <TouchableOpacity activeOpacity={0.7} onPress={() => setCounter(counter - 1)}>
                <Ripple rippleCentered style={[utilSpacing.px4, utilSpacing.py2]}>
                  <AutoImage style={styles.iconUnities} source={images.minus}></AutoImage>
                </Ripple>
              </TouchableOpacity>
              <Text
                style={[styles.textUnities, styles.textCounter, utilText.textCenter]}
                text={`${counter}`}
                preset="bold"
              ></Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCounter(counter + 1)}>
                <Ripple rippleCentered style={[utilSpacing.px4, utilSpacing.py2]}>
                  <AutoImage style={styles.iconUnities} source={images.add}></AutoImage>
                </Ripple>
              </TouchableOpacity>
            </View>
          </View>

          <InputTextCard
            style={utilSpacing.m4}
            titleTx="dishDetailScreen.commentChef"
            placeholderTx="dishDetailScreen.placeHolderCommetChef"
            counter={100}
          ></InputTextCard>
          <Text tx="dishDetailScreen.moreProductsChef" preset="bold" style={utilSpacing.my5}></Text>
          <ScrollView horizontal style={utilSpacing.mb4}>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
          </ScrollView>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
        >
          <SvgUri height={35} width={35} source={images.cart}></SvgUri>
          <Text
            preset="bold"
            style={[styles.textAddToOrder, utilSpacing.mx3]}
            tx="dishDetailScreen.addToOrder"
          ></Text>
          <Text preset="bold" style={styles.textAddToOrder} text={price}></Text>
        </TouchableOpacity>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  addToOrder: {
    backgroundColor: color.primary,

    padding: spacing[3],
    textAlign: "center",
    ...SHADOW,
  },
  buttonUnities: {
    backgroundColor: color.palette.grayLigth,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerUnities: {
    alignItems: "center",
    backgroundColor: color.primary,
    borderRadius: spacing[1],
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  iconCart: {
    height: 23,
    wdith: 23,
  },
  iconUnities: {
    height: 20,
    width: 20,
  },
  image: {
    borderRadius: spacing[2],
    height: 200,
    width: "100%",
  },
  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
  textCounter: {
    marginBottom: -2,
    minWidth: spacing[3],
  },
  textUnities: {
    color: color.palette.white,
  },
})
