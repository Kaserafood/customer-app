import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import RNUxcam from "react-native-ux-cam"
import { Icon, Location, Screen } from "../../components"
import { DayDeliveryModal } from "../../components/day-delivery/day-delivery-modal"
import { ModalLocation } from "../../components/location/modal-location"
import { ModalWithoutCoverageCredits } from "../../components/modal-coverage/modal-without-coverage-credits"
import ModalDeliveryDatePlan from "../../components/modal-delivery-date/modal-delivery-date-plan"
import { useStores } from "../../models"
import { Banner as BannerModel } from "../../models/banner-store"
import { Category } from "../../models/category-store"
import { DishChef as DishModel } from "../../models/dish-store"
import { NavigatorParamList } from "../../navigators"
import { DatePlan } from "../../services/api"
import { color, spacing } from "../../theme"
import { SHADOW, utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { Banner } from "../home/banner"
import { ModalWelcome } from "../home/modal-welcome"
import BannerMain from "./banner-main"
import Categories from "./categories"
import Chefs, { DataState } from "./chefs"
import Dishes from "./dishes"
import Lunches from "./lunches"
import ValuePrepositions from "./value-prepositions"
import { UNITED_STATES } from "../../utils/constants"

const modalStateLocation = new ModalStateHandler()
const modalStateWelcome = new ModalStateHandler()
const modalStateWhy = new ModalStateHandler()
const modalStateDeliveryDatePlan = new ModalStateHandler()
const modalStateCoverageCredits = new ModalStateHandler()
const state = new DataState()

export const MainScreen: FC<StackScreenProps<NavigatorParamList, "main">> = observer(
  ({ navigation, route: { params } }) => {
    const { cartStore, commonStore, dishStore, plansStore, coverageStore, userStore } = useStores()
    const [currentDate, setCurrentDate] = useState<DatePlan>()

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

    const toDetail = (dish: DishModel) => {
      if (cartStore.hasItems) cartStore.cleanItems()
      /**
       *the chef id is set to 0 so that the dishes can be obtained the first time it enters dish-detail
       */
      commonStore.setCurrentChefId(0)
      dishStore.clearDishesChef()
      dishStore.setIsUpdate(false)
      navigation.navigate("dishDetail", {
        ...dish,
        tempId: undefined,
        quantity: undefined,
        noteChef: undefined,
        timestamp: undefined,
      })
    }

    const handlePressBanner = () => {
      if (!coverageStore.hasCoverageCredits) {
        modalStateCoverageCredits.setVisible(true)
        return
      }

      navigation.navigate("subscription")
    }

    const handleScreenNavigate = (screen: "plans" | "dishes") => {
      if (!coverageStore.hasCoverageCredits && screen === "plans") {
        modalStateCoverageCredits.setVisible(true)
        return
      }

      navigation.navigate(screen, { showBackIcon: true })
    }

    const handleLunchPress = () => {
      if (!coverageStore.hasCoverageCredits) {
        modalStateCoverageCredits.setVisible(true)
        return
      }

      navigation.navigate("plans", { showBackIcon: true })
    }

    return (
      <Screen preset="fixed" statusBar="dark-content" statusBarBackgroundColor={color.primary}>
        <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={[utilSpacing.pl5, utilSpacing.pr4]}
          ></Location>

          <TouchableOpacity
            style={[utilSpacing.py3, utilSpacing.px4, styles.btnSearch, utilSpacing.mr5]}
            onPress={() => navigation.navigate("search")}
          >
            <Icon name="magnifying-glass" color={color.primary} size={22}></Icon>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
          {!plansStore.hasActivePlan && <BannerMain onPress={handlePressBanner}></BannerMain>}

          <ValuePrepositions screenNavigate={handleScreenNavigate}></ValuePrepositions>
          {currentDate?.date && userStore.countryId !== UNITED_STATES && (
            <Lunches
              currentDate={currentDate}
              showModalDates={() => modalStateDeliveryDatePlan.setVisible(true)}
              toPlans={handleLunchPress}
            ></Lunches>
          )}

          <Dishes
            onWhyPress={(state) => modalStateWhy.setVisible(state)}
            onDishPress={toDetail}
          ></Dishes>
          <View style={utilSpacing.mt5}>
            <Banner
              onPressWelcome={() => modalStateWelcome.setVisible(true)}
              onPressNewChefs={() => navigation.navigate("newChefs")}
              onBannerPress={onBannerPress}
            ></Banner>
          </View>
          <Categories onPress={(category) => toCategory(category)}></Categories>
          <Chefs state={state}></Chefs>
          {!plansStore.hasActivePlan && <BannerMain onPress={handlePressBanner}></BannerMain>}
        </ScrollView>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
        <DayDeliveryModal modal={modalStateWhy}></DayDeliveryModal>
        <ModalDeliveryDatePlan
          state={modalStateDeliveryDatePlan}
          onSelectDate={setCurrentDate}
        ></ModalDeliveryDatePlan>
        <ModalWelcome modalState={modalStateWelcome}></ModalWelcome>
        <ModalWithoutCoverageCredits
          modalState={modalStateCoverageCredits}
        ></ModalWithoutCoverageCredits>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  btnSearch: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  containerLocation: {
    backgroundColor: color.primary,
    ...SHADOW,
    height: 63,
  },
  location: {
    backgroundColor: color.palette.white,
  },
})
