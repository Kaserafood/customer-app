import React, { FC, useLayoutEffect } from "react"
import { StatusBar, StyleSheet, View } from "react-native"
import { AppEventsLogger } from "react-native-fbsdk-next"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import images from "../../assets/images"
import { Card, Header, Image, ModalRequestDish, Screen, Text } from "../../components"
import { ModalLocation } from "../../components/location/modal-location"
import { useStores } from "../../models"
import { Category } from "../../models/category-store"
import { goBack } from "../../navigators/navigation-utilities"
import { NavigatorParamList } from "../../navigators/navigator-param-list"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"

const modalStateRequest = new ModalStateHandler()
const modalStateLocation = new ModalStateHandler()
export const SearchScreen: FC<StackScreenProps<NavigatorParamList, "search">> = observer(
  ({ navigation }) => {
    useLayoutEffect(() => {
      changeNavigationBarColor(color.palette.white, true, true)
    }, [])

    const {
      categoryStore: { categories },
      userStore,
    } = useStores()

    const toCategory = (category: Category) => {
      AppEventsLogger.logEvent("categoryPress", 1, {
        id: category.id,
        name: category.name,
        description: "Se ha seleccionado una categoría en la ventana de 'Buscar'",
      })

      navigation.navigate("category", {
        ...category,
      })
    }

    const openRequestDish = () => {
      modalStateRequest.setVisible(true)
      AppEventsLogger.logEvent("openModalRequestDish", 1, {
        description: "Se ha abierto la ventana de solicitar un platillo",
      })
    }

    return (
      <Screen preset="fixed" statusBar="dark-content" statusBarBackgroundColor={color.primary}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor={color.primary} />
        <Header
          headerTx="searchScreen.title"
          titleStyle={[utilSpacing.pt2, utilSpacing.mb2]}
          onLeftPress={goBack}
        />
        <ScrollView style={styles.body}>
          <View style={utilSpacing.mb5}>
            {userStore.userId > 0 && (
              <Ripple
                rippleOpacity={0.2}
                rippleDuration={400}
                style={utilSpacing.mt7}
                onPress={openRequestDish}
              >
                <Card style={styles.card}>
                  <View style={[utilFlex.flexRow, utilFlex.flexCenter]}>
                    <Image style={[utilSpacing.mr2, styles.image]} source={images.step1}></Image>
                    <Text
                      style={utilSpacing.mt4}
                      preset="semiBold"
                      numberOfLines={1}
                      tx="searchScreen.somethingDiferent"
                    ></Text>
                  </View>
                </Card>
              </Ripple>
            )}
          </View>

          {categories.map(
            (category: Category, index: number) =>
              index % 2 === 0 && (
                <View key={category.id} style={[utilFlex.flexRow, utilSpacing.mb6, styles.row]}>
                  <Ripple
                    rippleOpacity={0.2}
                    rippleDuration={400}
                    onPress={() => toCategory(category)}
                    style={styles.containerCard}
                  >
                    <Card style={styles.card}>
                      <Image
                        style={[utilSpacing.mr2, styles.image]}
                        source={{ uri: category.image }}
                      ></Image>
                      <View style={[utilFlex.flexCenter, utilFlex.flex1]}>
                        <Text
                          style={[utilSpacing.mt4, styles.text]}
                          preset="semiBold"
                          numberOfLines={2}
                          text={category.name}
                        ></Text>
                      </View>
                    </Card>
                  </Ripple>

                  {index < categories.length - 1 && (
                    <Ripple
                      rippleOpacity={0.2}
                      rippleDuration={400}
                      onPress={() => toCategory(categories[index + 1])}
                      style={styles.containerCard}
                    >
                      <Card style={styles.card}>
                        <Image
                          style={[utilSpacing.mr2, styles.image]}
                          source={{ uri: categories[index + 1]?.image }}
                        ></Image>
                        <View style={[utilFlex.flexCenter, utilFlex.flex1]}>
                          <Text
                            style={[utilSpacing.mt4, styles.text]}
                            preset="semiBold"
                            numberOfLines={2}
                            text={categories[index + 1]?.name}
                          ></Text>
                        </View>
                      </Card>
                    </Ripple>
                  )}
                </View>
              ),
          )}
        </ScrollView>
        <ModalRequestDish modalState={modalStateRequest}></ModalRequestDish>
        <ModalLocation screenToReturn="main" modal={modalStateLocation}></ModalLocation>
      </Screen>
    )
  },
)

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused()

  return isFocused ? <StatusBar {...props} /> : null
}

const styles = StyleSheet.create({
  body: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "88%",
  },
  card: {
    alignItems: "center",
    borderRadius: spacing[3],
    display: "flex",
    flex: 1,
    marginHorizontal: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[4],
  },
  container: {
    backgroundColor: color.background,
  },
  containerCard: {
    width: "48%",
  },
  image: {
    height: 100,
    width: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  text: {
    lineHeight: 20,
  },
})
