import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { Linking, ScrollView, StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import OneSignal from "react-native-onesignal"
import RNUxcam from "react-native-ux-cam"
import { Icon, Location, Screen, Text } from "../../components"
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
import { utilFlex, utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { UNITED_STATES } from "../../utils/constants"
import { getInstanceMixpanel } from "../../utils/mixpanel"
import { ModalStateHandler } from "../../utils/modalState"
import { checkNotificationPermission, requestNotificationPermission } from "../../utils/permissions"
import { Banner } from "../home/banner"
import { ModalWelcome } from "../home/modal-welcome"
import BannerMain from "./banner-main"
import Categories from "./categories"
import Chefs, { DataState } from "./chefs"
import Dishes from "./dishes"
import Lunches from "./lunches"
import ModalNotificationInfo from "./modal-notification-info"
import Sliders from "./sliders"
import ValuePrepositions from "./value-prepositions"

const modalStateLocation = new ModalStateHandler()
const modalStateWelcome = new ModalStateHandler()
const modalStateWhy = new ModalStateHandler()
const modalStateDeliveryDatePlan = new ModalStateHandler()
const modalStateCoverageCredits = new ModalStateHandler()
const modalStateNotification = new ModalStateHandler()
const state = new DataState()

const mixpanel = getInstanceMixpanel()
export const MainScreen: FC<StackScreenProps<NavigatorParamList, "main">> = observer(
  ({ navigation, route: { params } }) => {
    const {
      cartStore,
      commonStore,
      dishStore,
      plansStore,
      coverageStore,
      userStore,
      couponModalStore,
      addressStore,
    } = useStores()
    const [currentDate, setCurrentDate] = useState<DatePlan>()

    const [isAtTop, setIsAtTop] = useState(true)

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

      mixpanel.track("Banner press", {
        screen: "home",
        category: category.name,
        id: category.id,
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const toCategory = (category: Category) => {
      RNUxcam.logEvent("categoryTap", {
        screen: "home",
        category: category.name,
        id: category.id,
      })

      mixpanel.track("Category press", {
        screen: "home",
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

    useEffect(() => {
      mixpanel.track("Main Screen")
    }, [])

    useEffect(() => {
      if (addressStore.current.id > 0) {
        checkNotificationPermission().then((result) => {
          if (!result) {
            if (userStore.requestEnableNotification) modalStateNotification.setVisible(true)
          } else {
            enableNotifications()
          }
        })
      }
    }, [addressStore.current?.id])

    const enableNotifications = () => {
      OneSignal.setAppId("c6f16d8c-f9d4-4d3b-8f25-a1b24ac2244a")

      requestNotificationPermission().then((res) => {
        if (res) {
          mixpanel.track("Enabled Notifications")
          modalStateNotification.setVisible(false)
          OneSignal.setNotificationOpenedHandler(async (openedEvent) => {
            const { notification } = openedEvent

            if (notification.launchURL?.length > 0) Linking.openURL(notification.launchURL)

            const data: any = notification.additionalData
            if (data && data.type === "coupon") {
              couponModalStore.setVisible(true)
              if (data.title?.length > 0) couponModalStore.setTitle(data.title)
              if (data.subtitle?.length > 0) couponModalStore.setSubtitle(data.subtitle)
              if (data.image?.length > 0) couponModalStore.setImage(data.image)
            }

            if (data.notification_topic != null) {
              OneSignal.addTrigger("notification_topic", data.notification_topic)
            }
          })
        }
      })
    }

    const handleSearch = () => {
      mixpanel.track("Search Main Screen press")
      navigation.navigate("search")
    }

    const handleScroll = (event) => {
      const { contentOffset } = event.nativeEvent

      const isAtTop = contentOffset.y === 0

      setIsAtTop(isAtTop)
    }

    return (
      <Screen
        preset="fixed"
        bottomBar="light-content"
        statusBar="dark-content"
        statusBarBackgroundColor={color.palette.white}
      >
        <View style={[styles.containerLocation, utilSpacing.py4, utilFlex.flexRow]}>
          <Location
            onPress={() => {
              modalStateLocation.setVisible(true)
            }}
            style={[utilSpacing.pl5, utilSpacing.pr5]}
          ></Location>
        </View>

        <View style={[styles.containerSearch, utilSpacing.px5, !isAtTop && styles.borderBottom]}>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={400}
            rippleContainerBorderRadius={150}
            style={[
              styles.search,
              utilSpacing.py4,
              utilSpacing.px4,
              utilSpacing.mb4,
              utilFlex.flexRow,
              styles.shadow,
              utilFlex.flexCenterVertical,
            ]}
            onPress={handleSearch}
          >
            <Icon name="search" type="Octicons" color={color.palette.black} size={18}></Icon>
            <Text tx="mainScreen.search" style={utilSpacing.ml3}></Text>
          </Ripple>
        </View>

        <ScrollView onScroll={handleScroll} style={styles.container}>
          <Sliders onWithoutCoverage={() => modalStateCoverageCredits.setVisible(true)}></Sliders>

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
        <ModalNotificationInfo
          enablePress={enableNotifications}
          state={modalStateNotification}
        ></ModalNotificationInfo>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor: palette.grayLight,
    borderBottomWidth: 1,
  },
  btnSearch: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  container: {
    backgroundColor: color.background,
    flex: 1,
  },
  containerLocation: {
    // backgroundColor: color.primary,
    // ...SHADOW,
    // height: 63,
  },
  containerSearch: {
    // position: "absolute",
    // top: 0,
  },
  imgRosca: {
    height: 230,

    width: "100%",
  },

  location: {
    backgroundColor: color.palette.white,
  },
  search: {
    backgroundColor: color.palette.white,
    borderRadius: spacing[3],
  },
  shadow: {
    elevation: 5,
    shadowColor: color.palette.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,

    shadowRadius: 20,
  },
})
