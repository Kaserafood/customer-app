import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { goBack, NavigatorParamList } from "../../navigators"
import { AutoImage, Header, ModalCart, Price, Screen, Separator, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"
import { DayDelivery } from "../../components/day-delivery/day-delivery"
import SvgUri from "react-native-svg-uri"
import { SHADOW, utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { create } from "apisauce"
import { spacing } from "../../theme/spacing"
import images from "assets/images"
import { ScrollView } from "react-native-gesture-handler"
import { makeAutoObservable } from "mobx"

class ModalState {
  isVisible = false
  setVisible(state: boolean) {
    this.isVisible = state
  }

  constructor() {
    makeAutoObservable(this)
  }
}
const modalState = new ModalState()
export const MenuChefScreen: FC<StackScreenProps<NavigatorParamList, "menuChef">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const toDeliveryDetail = () => {
      navigation.navigate("deliveryDetail")
    }
    return (
      <Screen preset="fixed" style={[utilSpacing.pb6, styles.container]}>
        <Header headerTx="menuChefScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView style={styles.container}>
          <View style={utilSpacing.pl4}>
            <DayDelivery hideWhyButton></DayDelivery>
          </View>

          <View style={styles.card}>
            <View style={utilFlex.flexRow}>
              <View>
                <AutoImage style={styles.imageChef} source={images.chef2}></AutoImage>
                <Text style={utilSpacing.mt2} preset="bold" text="Rebeca A"></Text>
              </View>
              <View style={utilFlex.flex1}>
                <Text
                  style={utilSpacing.mx3}
                  numberOfLines={5}
                  text="Me encatanca coincar, condiao desqeu tento 12 ños, aprndei aprndi acocicandf lroadslorem  lorem aprecio a ociandr cdesce que ten o123 ñaos"
                ></Text>
              </View>
            </View>
            <Text
              preset="semiBold"
              style={utilText.textGray}
              text="Guatemalteca - Almuerzo  - Postes"
            ></Text>
            <Price amount={30} preset="delivery"></Price>
          </View>
          <View style={utilSpacing.m4}>
            <Text
              preset="bold"
              size="lg"
              tx="menuChefScreen.all"
              style={styles.textSeparator}
            ></Text>
            <Separator style={utilSpacing.mt4}></Separator>
          </View>

          <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb1]}>
            <View style={utilFlex.flex1}>
              <Text text="Enchiladas veres" preset="bold"></Text>
              <Text
                numberOfLines={3}
                size="sm"
                text="Cuatro enchiladas con sadla vede,queisoy cebool por arriba"
                style={utilText.textGray}
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View>
              <AutoImage source={images.dish2} style={styles.imageDish}></AutoImage>
            </View>
          </View>
          <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb2]}>
            <View style={utilFlex.flex1}>
              <Text text="Enchiladas veres" preset="bold"></Text>
              <Text
                numberOfLines={3}
                size="sm"
                text="Cuatro enchiladas con sadla vede,queisoy cebool por arriba"
                style={utilText.textGray}
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View>
              <AutoImage source={images.dish2} style={styles.imageDish}></AutoImage>
            </View>
          </View>
          <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb2]}>
            <View style={utilFlex.flex1}>
              <Text text="Enchiladas veres" preset="bold"></Text>
              <Text
                numberOfLines={3}
                size="sm"
                text="Cuatro enchiladas con sadla vede,queisoy cebool por arriba"
                style={utilText.textGray}
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View>
              <AutoImage source={images.dish2} style={styles.imageDish}></AutoImage>
            </View>
          </View>
          <View style={[styles.card, utilFlex.flexRow, utilSpacing.mb2]}>
            <View style={utilFlex.flex1}>
              <Text text="Enchiladas veres" preset="bold"></Text>
              <Text
                numberOfLines={3}
                size="sm"
                text="Cuatro enchiladas con sadla vede,queisoy cebool por arriba"
                style={utilText.textGray}
              ></Text>
              <Price style={styles.price} amount={30}></Price>
            </View>
            <View>
              <AutoImage source={images.dish2} style={styles.imageDish}></AutoImage>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => modalState.setVisible(true)}
          activeOpacity={0.7}
          style={[styles.addToOrder, utilFlex.flexCenter, utilFlex.flexRow]}
        >
          <SvgUri height={35} width={35} source={images.cart}></SvgUri>
          <Text
            preset="bold"
            style={[styles.textAddToOrder, utilSpacing.mx3]}
            tx="menuChefScreen.watchCart"
          ></Text>
          <Text preset="bold" style={styles.textAddToOrder} text="Q34"></Text>
        </TouchableOpacity>
        <ModalCart onContinue={toDeliveryDetail} modal={modalState}></ModalCart>
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
  card: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[2],
    margin: spacing[3],
    padding: spacing[3],
    ...SHADOW,
  },
  container: {
    backgroundColor: color.palette.white,
  },
  containerSeparator: {
    alignItems: "center",
  },
  imageChef: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  imageDish: {
    borderRadius: spacing[2],
    height: 100,
    width: 150,
  },
  price: {
    bottom: 0,
    position: "absolute",
  },

  textAddToOrder: {
    color: color.palette.white,
    fontSize: 20,
  },
  textSeparator: {
    backgroundColor: color.palette.white,
    left: spacing[4],
    paddingHorizontal: spacing[2],
    position: "absolute",
    top: 1,
    zIndex: 1,
  },
})
