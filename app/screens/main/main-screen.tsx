import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import RNUxcam from "react-native-ux-cam"
import { Location, Screen } from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { ModalLocation } from "../../components/location/modal-location"
import { Banner as BannerModel } from "../../models/banner-store"
import { Category } from "../../models/category-store"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { SHADOW, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { Banner } from "../home/banner"
import BannerMain from "./banner-main"
import Categories from "./categories"
import Chefs, { DataState } from "./chefs"
import Dishes from "./dishes"
import Lunches from "./lunches"
import ValuePrepositions from "./value-prepositions"

const modalStateLocation = new ModalStateHandler()
const modalStateWelcome = new ModalStateHandler()
const modalStateWhy = new ModalStateHandler()
const state = new DataState()

export const MainScreen: FC<StackScreenProps<NavigatorParamList, "main">> = observer(
  ({ navigation, route: { params } }) => {
    const onBannerPress = (banner: BannerModel) => {
      const category: Category = {
        id: banner.categoryId,
        name: banner.categoryName,
        image: "",
      }
      RNUxcam.logEvent("bannerTap", {
        category: category.name,
        id: category.id,
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const toCategory = (category: Category) => {
      RNUxcam.logEvent("categoryTap", {
        screen: "chefs",
        category: category.name,
        id: category.id,
      })
      navigation.navigate("category", {
        ...category,
      })
    }

    return (
      <Screen
        preset="fixed"
        // style={styles.container}
        statusBar="dark-content"
        statusBarBackgroundColor={color.primary}
      >
        <View style={[styles.containerLocation, utilSpacing.py4]}>
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={utilSpacing.px5}
          ></Location>
        </View>

        <ScrollView style={styles.container}>
          <BannerMain></BannerMain>
          <ValuePrepositions></ValuePrepositions>
          {/* <Separator style={[utilSpacing.mx5, utilSpacing.mt3]}></Separator> */}
          <Lunches></Lunches>
          <Dishes onWhyPress={(state) => modalStateWhy.setVisible(state)}></Dishes>
          <View style={utilSpacing.mt5}>
            <Banner
              onPressWelcome={() => modalStateWelcome.setVisible(true)}
              onPressNewChefs={() => navigation.navigate("newChefs")}
              onBannerPress={onBannerPress}
            ></Banner>
          </View>
          <Categories></Categories>
          <Chefs state={state}></Chefs>
          <BannerMain></BannerMain>
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <DayDeliveryModal modal={modalStateWhy}></DayDeliveryModal>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  containerLocation: {
    backgroundColor: color.primary,
    ...SHADOW,
    height: 68,
  },
  location: {
    backgroundColor: color.palette.white,
  },
})
