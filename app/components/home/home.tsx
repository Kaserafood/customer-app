import React from "react"
import {
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"
import { Separator } from "../separator/separator"
import { AutoImage } from "../auto-image/auto-image"
import { utilSpacing } from "../../theme/Util"
import Images from "assets/images"
import { Location } from "../location/location"
import { DayDelivery } from "../day-delivery/day-delivery"
import { LocationModal } from "../location/location-modal"
import { DayDeliveryModal } from "../day-delivery/day-delivery-modal"
import { Categories } from "../categories/categories"
import { Price } from "../price/price"
import { DishChef } from "../dish-chef/dish-chef"

import { useNavigation } from "@react-navigation/native"
import Ripple from "react-native-material-ripple"

export interface HomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Home page component
 */
export const Home = observer(function Home(props: HomeProps) {
  const { style } = props

  const navigation = useNavigation()

  const toDishDetail = () => navigation.navigate("dishDetail" as never)
  const toInit = () => navigation.navigate("init" as never)

  return (
    <>
      <ScrollView style={[style, styles.container]}>
        <Location></Location>
        <DayDelivery></DayDelivery>
        <Separator style={utilSpacing.my4}></Separator>
        <Categories></Categories>
        <Separator style={utilSpacing.my4}></Separator>
        <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
        <View>
          <Ripple
            style={utilSpacing.my5}
            rippleOpacity={0.2}
            rippleDuration={200}
            onPress={toDishDetail}
          >
            <View style={styles.flex}>
              <View style={styles.containerTextDish}>
                <Text tx="mainScreen.itemTitle" preset="semiBold"></Text>
                <Text
                  tx="mainScreen.itemDescription"
                  style={styles.descriptionDish}
                  numberOfLines={2}
                ></Text>

                <Text
                  style={[styles.chefDish, utilSpacing.mt4]}
                  size="sm"
                  tx="mainScreen.chef"
                ></Text>

                <View style={styles.flex}>
                  <Price amount={100}></Price>
                  <AutoImage style={styles.iconShipping} source={Images.iconShipping}></AutoImage>
                  <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                </View>
              </View>
              <View>
                <AutoImage style={styles.imageDish} source={Images.dish1}></AutoImage>
                <AutoImage style={styles.imageChef} source={Images.chef1}></AutoImage>
              </View>
            </View>
          </Ripple>
          <Separator style={utilSpacing.my3}></Separator>

          <Ripple style={utilSpacing.my5} rippleOpacity={0.2} rippleDuration={200} onPress={toInit}>
            <View style={styles.flex}>
              <View style={styles.containerTextDish}>
                <Text tx="mainScreen.itemTitle" preset="semiBold"></Text>
                <Text
                  tx="mainScreen.itemDescription"
                  style={styles.descriptionDish}
                  numberOfLines={2}
                ></Text>

                <Text
                  style={[styles.chefDish, utilSpacing.mt4]}
                  size="sm"
                  tx="mainScreen.chef"
                ></Text>

                <View style={styles.flex}>
                  <Price amount={100}></Price>
                  <AutoImage style={styles.iconShipping} source={Images.iconShipping}></AutoImage>
                  <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                </View>
              </View>
              <View>
                <AutoImage style={styles.imageDish} source={Images.dish1}></AutoImage>
                <AutoImage style={styles.imageChef} source={Images.chef1}></AutoImage>
              </View>
            </View>
          </Ripple>
          <Separator style={utilSpacing.my3}></Separator>
          <View style={[utilSpacing.mt5, utilSpacing.mb7]}>
            <View style={styles.flex}>
              <View style={styles.containerTextDish}>
                <Text tx="mainScreen.itemTitle" preset="semiBold"></Text>
                <Text
                  tx="mainScreen.itemDescription"
                  style={styles.descriptionDish}
                  numberOfLines={2}
                ></Text>

                <Text
                  style={[styles.chefDish, utilSpacing.mt4]}
                  size="sm"
                  tx="mainScreen.chef"
                ></Text>

                <View style={styles.flex}>
                  <Price amount={100}></Price>
                  <AutoImage style={styles.iconShipping} source={Images.iconShipping}></AutoImage>
                  <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                </View>
              </View>
              <View>
                <AutoImage style={styles.imageDish} source={Images.dish1}></AutoImage>
                <AutoImage style={styles.imageChef} source={Images.chef1}></AutoImage>
              </View>
            </View>
          </View>

          <Text
            style={utilSpacing.mt4}
            size="lg"
            tx="mainScreen.favoriteTomorrow"
            preset="bold"
          ></Text>

          <Separator style={utilSpacing.my3}></Separator>
          <ScrollView horizontal style={styles.flex}>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
            <DishChef></DishChef>
          </ScrollView>
          <Separator style={utilSpacing.my3}></Separator>

          <View style={utilSpacing.my5}>
            <View style={styles.flex}>
              <View style={styles.containerTextDish}>
                <Text tx="mainScreen.itemTitle" preset="semiBold"></Text>
                <Text
                  tx="mainScreen.itemDescription"
                  style={styles.descriptionDish}
                  numberOfLines={2}
                ></Text>

                <Text
                  style={[styles.chefDish, utilSpacing.mt4]}
                  size="sm"
                  tx="mainScreen.chef"
                ></Text>

                <View style={styles.flex}>
                  <Price amount={34}></Price>
                  <AutoImage style={styles.iconShipping} source={Images.iconShipping}></AutoImage>
                  <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                </View>
              </View>
              <View>
                <AutoImage style={styles.imageDish} source={Images.dish1}></AutoImage>
                <AutoImage style={styles.imageChef} source={Images.chef1}></AutoImage>
              </View>
            </View>
          </View>
          <Separator style={utilSpacing.my3}></Separator>

          <View style={utilSpacing.my5}>
            <View style={styles.flex}>
              <View style={styles.containerTextDish}>
                <Text tx="mainScreen.itemTitle" preset="semiBold"></Text>
                <Text
                  tx="mainScreen.itemDescription"
                  style={styles.descriptionDish}
                  numberOfLines={2}
                ></Text>

                <Text
                  style={[styles.chefDish, utilSpacing.mt4]}
                  size="sm"
                  tx="mainScreen.chef"
                ></Text>

                <View style={styles.flex}>
                  <Price amount={23}></Price>
                  <AutoImage style={styles.iconShipping} source={Images.iconShipping}></AutoImage>
                  <Text style={utilSpacing.ml2} tx="mainScreen.priceExample"></Text>
                </View>
              </View>
              <View>
                <AutoImage style={styles.imageDish} source={Images.dish1}></AutoImage>
                <AutoImage style={styles.imageChef} source={Images.chef1}></AutoImage>
              </View>
            </View>
          </View>
          <Separator style={utilSpacing.my3}></Separator>
        </View>
      </ScrollView>
      <LocationModal></LocationModal>
      <DayDeliveryModal></DayDeliveryModal>
    </>
  )
})

const styles = StyleSheet.create({
  chefDish: {
    color: color.palette.grayDark,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },

  containerTextDish: {
    flex: 1,
    marginRight: spacing[3],
  },

  descriptionDish: {
    color: color.palette.grayDark,
  },

  flex: {
    display: "flex",
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  iconShipping: {
    height: 24,
    marginLeft: spacing[4],
    width: 24,
  },
  imageChef: {
    borderColor: color.palette.white,
    borderRadius: 16,
    borderWidth: 1,
    bottom: 0,
    height: 50,
    position: "absolute",
    right: spacing[1],
    width: 50,
  },

  imageDish: {
    borderRadius: 8,
    height: 105,
    width: 140,
  },
})
