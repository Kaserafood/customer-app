import { StackScreenProps } from "@react-navigation/stack"
import images from "../../assets/images"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import { AutoImage, Button, Card, Header, Screen, Text } from "../../components"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { spacing } from "../../theme/spacing"
import { utilFlex, utilSpacing } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.whiteGray,
  flex: 1,
}

export const EndOrderScreen: FC<StackScreenProps<NavigatorParamList, "endOrder">> = observer(
  ({ navigation }) => {
    const toMain = () => navigation.navigate("main")
    return (
      <Screen style={ROOT} preset="scroll">
        <Header headerTx="endOrderScreen.title" />
        <ScrollView>
          <Card style={[styles.card, utilSpacing.px5]}>
            <Text tx="endOrderScreen.deliveryOn" caption></Text>
            <Text text="Colonia colocao.,234234 aer2  qe 43q2ewf" style={utilSpacing.mb4}></Text>

            <Text tx="endOrderScreen.deliveryDate" caption></Text>
            <Text text="Sab, 5 may. 1pm a 3pm"></Text>
          </Card>
          <Text preset="bold" style={utilSpacing.p5} tx="endOrderScreen.info"></Text>
          <View style={[utilFlex.flexCenter, utilSpacing.my6]}>
            <Text size="lg" text="Pedido #234" preset="bold"></Text>
          </View>
          <View style={[utilFlex.flexCenter, styles.content]}>
            <View style={[styles.body, utilFlex.flexCenter]}>
              <Text style={utilSpacing.my5} tx="endOrderScreen.thankYou" preset="bold"></Text>
              <AutoImage style={styles.imageChef} source={images.chef1}></AutoImage>
              <Text style={utilSpacing.my5} preset="bold" tx="endOrderScreen.cookWithLove"></Text>
            </View>
          </View>
          <View
            style={[styles.containerButton, utilFlex.flexCenter, utilSpacing.p4, utilSpacing.mt7]}
          >
            <Button
              onPress={toMain}
              style={[styles.button, utilSpacing.my4]}
              block
              rounded
              tx="endOrderScreen.continueExplore"
            ></Button>
          </View>
        </ScrollView>
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
  imageChef: {
    alignSelf: "center",
    borderRadius: spacing[4],
    display: "flex",
    height: 200,
    width: 200,
  },
})
