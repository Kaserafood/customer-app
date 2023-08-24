import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import RNUxcam from "react-native-ux-cam"
import { Button, Card, Header, Image, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { spacing } from "../../theme/spacing"
import { getI18nText } from "../../utils/translate"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.whiteGray,
  flex: 1,
}

export const EndOrderScreen: FC<StackScreenProps<NavigatorParamList, "endOrder">> = observer(
  function ({ route: { params }, navigation }) {
    const { orderId, isPlan } = params
    const toMain = () => {
      RNUxcam.logEvent("endOrderContinue")
      navigation.navigate("main")
    }

    const [order, setOrder] = useState("")
    const [thankYou, setThankYou] = useState("")
    const { userStore, cartStore } = useStores()
    useEffect(() => {
      cartStore.cleanItems()
      if (orderId) setOrder(`${getI18nText("endOrderScreen.order")} #${params.orderId}`)
      setThankYou(`¡${getI18nText("endOrderScreen.thankYou")} ${userStore.displayName}!`)
    }, [])

    return (
      <Screen style={ROOT} preset="fixed">
        <Header style={styles.header} headerTx="endOrderScreen.title" />
        <ScrollView style={utilSpacing.pb7}>
          <Card style={[styles.card, utilSpacing.p5]}>
            <Text tx="endOrderScreen.deliveryOn" preset="bold"></Text>
            <Text text={params.deliveryAddress} caption style={utilSpacing.mb4}></Text>
            {!isPlan ? (
              <>
                <Text tx="endOrderScreen.deliveryDate" preset="bold"></Text>
                <Text caption text={`${params.deliveryDate} ${params.deliveryTime}`}></Text>
              </>
            ) : (
              <>
                <Text tx="endOrderScreen.deliveryDate" preset="bold"></Text>
                <Text caption text={`${params.deliveryDate}`}></Text>
                <Text caption style={utilSpacing.mt3} text={`${params.deliveryTime}`}></Text>
              </>
            )}
          </Card>
          <Text preset="bold" style={utilSpacing.p5} tx="endOrderScreen.info"></Text>
          {isPlan && (
            <View style={[utilFlex.flexCenter, utilSpacing.my6]}>
              <Text size="lg" text={order} preset="bold"></Text>
            </View>
          )}
          <View>
            <View style={[utilFlex.flexCenter, styles.content, utilSpacing.py5, utilSpacing.mb7]}>
              <View style={[styles.body, utilFlex.flexCenter]}>
                <View></View>
                <Text style={utilSpacing.my5} size="lg" text={thankYou} preset="bold"></Text>
                <Image style={styles.imageChef} source={{ uri: params.imageChef }}></Image>
                <Text
                  style={utilSpacing.my5}
                  size="lg"
                  preset="bold"
                  tx="endOrderScreen.cookWithLove"
                ></Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.containerButton, utilFlex.flexCenter, utilSpacing.p4]}>
          <Button
            onPress={toMain}
            style={[styles.button, utilSpacing.my4]}
            block
            tx="common.continue"
          ></Button>
        </View>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    width: 200,
  },
  button: {
    width: "75%",
  },
  card: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  containerButton: {
    backgroundColor: color.background,
  },
  content: {
    alignSelf: "center",
    backgroundColor: color.background,
    borderRadius: spacing[4],
    display: "flex",
    width: "80%",
  },
  header: {
    height: 70,
  },
  imageChef: {
    alignSelf: "center",
    borderRadius: spacing[4],
    display: "flex",
    height: 200,
    width: 200,
  },
})
