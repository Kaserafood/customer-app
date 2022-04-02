import React, { Component, FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet, View, ScrollView, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import {
  AutoImage,
  BottomNavigation,
  Button,
  Chip,
  Screen,
  Separator,
  Text,
} from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import Images from "assets/images"

import { spacing } from "../../theme/spacing"
import SvgUri from "react-native-svg-uri"
import { utilSpacing } from "../../theme/Util"
import Modal from "react-native-modal"
import changeNavigationBarColor from "react-native-navigation-bar-color"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

export const MainScreen: FC<StackScreenProps<NavigatorParamList, "main">> = observer(
  function MainScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const [isModalWhyVisible, setModalWhyVisible] = useState(false)
    const [isModalAddressVisible, setModalAddressVisible] = useState(false)

    return (
      <Screen
        style={ROOT}
        preset="scroll"
        statusBar="dark-content"
        bottomBar="dark-content"
        statusBarBackgroundColor={isModalWhyVisible ? color.palette.whiteGray : color.palette.white}
      >
        <ScrollView style={styles.container}>
          <View style={styles.containerAddress}>
            <TouchableOpacity
              onPress={() => setModalAddressVisible(true)}
              style={styles.btnAddress}
              activeOpacity={0.7}
            >
              <SvgUri width="24" height="24" source={require("./location.svg")} />
              <Text numberOfLines={1} style={styles.textAddress} tx="mainScreen.address"></Text>
              <SvgUri width="24" height="24" source={require("./caret-down.svg")} />
            </TouchableOpacity>
          </View>
          <View style={[styles.flex, utilSpacing.mt6, styles.why]}>
            <Text tx="mainScreen.dayShipping" preset="semiBold" style={styles.dayShipping}></Text>
            <Chip tx="mainScreen.why" onPress={() => setModalWhyVisible(true)}></Chip>
          </View>
          <ScrollView horizontal style={[styles.flex, utilSpacing.mt5, utilSpacing.pb3]}>
            <Chip tx="mainScreen.tomorrow" style={styles.chip}></Chip>
            <Chip active text="Jue. May 16" style={utilSpacing.mr3}></Chip>
            <Chip text="Vier. May 17" style={utilSpacing.mr3}></Chip>
            <Chip text="Sab. May 18" style={utilSpacing.mr3}></Chip>
            <Chip text="Dom. May 19" style={utilSpacing.mr3}></Chip>
          </ScrollView>
          <Separator style={utilSpacing.my4}></Separator>
          <Text size="lg" tx="mainScreen.categories" preset="bold"></Text>
          <ScrollView horizontal style={[styles.flex, utilSpacing.mt3]}>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.hamburger}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.hamburguer"></Text>
            </View>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.nikkei}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.nikkei"></Text>
            </View>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.pizzas}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.pizza"></Text>
            </View>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.hamburger}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.hamburguer"></Text>
            </View>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.nikkei}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.nikkei"></Text>
            </View>
            <View style={[utilSpacing.p4, styles.containerCategoryItem]}>
              <AutoImage style={styles.imgCategory} source={Images.pizzas}></AutoImage>
              <Text style={utilSpacing.mt3} tx="mainScreen.pizza"></Text>
            </View>
          </ScrollView>
          <Separator style={utilSpacing.my4}></Separator>
          <Text size="lg" tx="mainScreen.delivery" preset="bold"></Text>
          <View>
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
                    <View style={styles.price}>
                      <Text tx="mainScreen.price"></Text>
                    </View>
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
                    <View style={styles.price}>
                      <Text tx="mainScreen.price"></Text>
                    </View>
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
                    <View style={styles.price}>
                      <Text tx="mainScreen.price"></Text>
                    </View>
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
              <View style={[styles.containerFavoriteImageDish, utilSpacing.m4]}>
                <AutoImage style={styles.favoriteImageDish} source={Images.dish2}></AutoImage>
                <Text preset="bold" numberOfLines={1} tx="placeholder.dishTitle"></Text>
                <View style={[styles.flex, utilSpacing.mt3]}>
                  <Text tx="mainScreen.of"></Text>
                  <Text tx="placeholder.chefName" numberOfLines={1} style={styles.flex1}></Text>
                  <View style={styles.price}>
                    <Text tx="mainScreen.price"></Text>
                  </View>
                </View>
              </View>
              <View style={[styles.containerFavoriteImageDish, utilSpacing.m4]}>
                <AutoImage style={styles.favoriteImageDish} source={Images.dish2}></AutoImage>
                <Text preset="bold" numberOfLines={1} tx="placeholder.dishTitle"></Text>
                <View style={[styles.flex, utilSpacing.mt3]}>
                  <Text tx="mainScreen.of"></Text>
                  <Text tx="placeholder.chefName" numberOfLines={1} style={styles.flex1}></Text>
                  <View style={styles.price}>
                    <Text tx="mainScreen.price"></Text>
                  </View>
                </View>
              </View>
              <View style={[styles.containerFavoriteImageDish, utilSpacing.m4]}>
                <AutoImage style={styles.favoriteImageDish} source={Images.dish2}></AutoImage>
                <Text preset="bold" numberOfLines={1} tx="placeholder.dishTitle"></Text>
                <View style={[styles.flex, utilSpacing.mt3]}>
                  <Text tx="mainScreen.of"></Text>
                  <Text tx="placeholder.chefName" numberOfLines={1} style={styles.flex1}></Text>
                  <View style={styles.price}>
                    <Text tx="mainScreen.price"></Text>
                  </View>
                </View>
              </View>
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
                    <View style={styles.price}>
                      <Text tx="mainScreen.price"></Text>
                    </View>
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
                    <View style={styles.price}>
                      <Text tx="mainScreen.price"></Text>
                    </View>
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
        <BottomNavigation></BottomNavigation>
        <Modal
          isVisible={isModalWhyVisible}
          backdropColor={color.palette.grayTransparent}
          backdropOpacity={1}
          animationIn="zoomIn"
          animationOut="zoomOut"
          coverScreen={false}
          onModalShow={() => changeNavigationBarColor(color.palette.whiteGray, true, true)}
        >
          <View style={styles.containerModal}>
            <View style={styles.bodyModal}>
              <View style={styles.containerImgClose}>
                <TouchableOpacity onPress={() => setModalWhyVisible(false)} activeOpacity={0.7}>
                  <AutoImage style={styles.imgClose} source={require("./close.png")}></AutoImage>
                </TouchableOpacity>
              </View>
              <View style={utilSpacing.p4}>
                <Text preset="bold" tx="mainScreen.modalWhy.title" style={utilSpacing.mb5}></Text>
                <Text tx="mainScreen.modalWhy.description"></Text>
                <View style={[styles.containerImgModalWhy, utilSpacing.my5]}>
                  <AutoImage
                    style={styles.imgModalWhy}
                    source={require("./ingredients.png")}
                  ></AutoImage>
                </View>

                <Button
                  tx="mainScreen.modalWhy.continue"
                  block
                  rounded
                  style={utilSpacing.mb5}
                  onPress={() => setModalWhyVisible(false)}
                ></Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isModalAddressVisible}
          backdropColor={color.palette.grayTransparent}
          backdropOpacity={1}
          animationIn="zoomIn"
          animationOut="zoomOut"
          coverScreen={false}
          onModalShow={() => changeNavigationBarColor(color.palette.whiteGray, true, true)}
        >
          <View style={styles.containerModal}>
            <View style={styles.bodyModal}>
              <View style={styles.containerImgClose}>
                <TouchableOpacity onPress={() => setModalAddressVisible(false)} activeOpacity={0.7}>
                  <AutoImage style={styles.imgClose} source={require("./close.png")}></AutoImage>
                </TouchableOpacity>
              </View>
              <View style={utilSpacing.p4}>
                <Text
                  preset="bold"
                  tx="mainScreen.modalAddress.title"
                  style={utilSpacing.mb5}
                ></Text>

                <TouchableOpacity style={styles.btnAddressAdd} activeOpacity={0.8}>
                  <Text preset="semiBold" tx="mainScreen.modalAddress.add"></Text>
                </TouchableOpacity>

                <ScrollView style={utilSpacing.my6}>
                  <View style={[styles.containerItemAddress, styles.flex]}>
                    <View style={utilSpacing.p4}>
                      <SvgUri width="24" height="24" source={require("./check.svg")}></SvgUri>
                    </View>
                    <View>
                      <Text preset="semiBold" tx="mainScreen.modalAddress.addressName"></Text>
                      <Text
                        size="sm"
                        style={styles.addressSubtitle}
                        tx="mainScreen.modalAddress.desc"
                      ></Text>
                    </View>
                  </View>
                </ScrollView>

                <Button
                  tx="mainScreen.modalWhy.continue"
                  block
                  rounded
                  style={utilSpacing.my5}
                  onPress={() => setModalAddressVisible(false)}
                ></Button>
              </View>
            </View>
          </View>
        </Modal>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  addressSubtitle: {
    color: color.palette.grayDark,
  },
  bodyModal: {
    backgroundColor: color.palette.white,
    borderRadius: 20,
    padding: spacing[3],
    width: "90%",
  },
  btnAddress: {
    backgroundColor: color.primary,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  btnAddressAdd: {
    borderColor: color.palette.grayDark,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: spacing[4],
    padding: spacing[3],
  },
  chefDish: {
    color: color.palette.grayDark,
  },
  chip: {
    marginBottom: spacing[2],
    marginRight: spacing[2],
  },
  container: {
    flex: 1,
    margin: spacing[3],
  },
  containerAddress: {
    flex: 1,
  },

  containerCategoryItem: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  containerFavoriteImageDish: {
    width: 150,
  },
  containerImgClose: {
    alignItems: "flex-end",
    display: "flex",
  },
  containerImgModalWhy: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  containerItemAddress: {
    alignItems: "center",
  },
  containerModal: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  containerTextDish: {
    flex: 1,
    marginRight: spacing[3],
  },
  dayShipping: {
    marginRight: spacing[2],
  },
  descriptionDish: {
    color: color.palette.grayDark,
  },
  favoriteImageDish: {
    borderRadius: 16,
    height: 110,
    width: 150,
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
  imgCategory: {
    height: 65,
    width: 65,
  },
  imgClose: {
    height: 20,
    width: 20,
  },
  imgModalWhy: {
    height: 150,
    width: 150,
  },
  price: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.greenLigth,
    borderRadius: 100,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[0],
  },
  textAddress: {
    color: color.palette.white,
    flex: 1,
    marginLeft: spacing[2],
  },
  why: {
    alignItems: "center",
  },
})
