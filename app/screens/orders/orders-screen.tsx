import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { AutoImage, Card, Header, Screen, Text } from "../../components"
import { goBack, NavigatorParamList } from "../../navigators"
import { color, spacing, typography } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

export const OrdersScreen: FC<StackScreenProps<NavigatorParamList, "orders">> = observer(
  function OrdersScreen() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
      <Screen style={styles.container} preset="scroll">
        <Header headerTx="ordersScreen.title" leftIcon="back" onLeftPress={goBack} />
        <SegmentedControl
          values={[getI18nText("ordersScreen.inProgress"), getI18nText("ordersScreen.previous")]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
          }}
          appearance="light"
          style={styles.segmentedControl}
          backgroundColor={color.palette.segmentedControl}
          tintColor={color.palette.white}
          activeFontStyle={{ color: color.text, fontFamily: typography.primarySemiBold }}
          fontStyle={{ color: color.text, fontFamily: typography.primarySemiBold }}
        />
        {selectedIndex === 0 ? (
          <View>
            <Card style={[utilSpacing.mx4, utilSpacing.mt4, utilSpacing.p4]}>
              <View style={utilFlex.flexRow}>
                <View>
                  <AutoImage source={images.chef1} style={styles.chefImage}></AutoImage>
                  <Text caption style={[utilFlex.selfCenter, utilSpacing.mt3]} text="#23423"></Text>
                </View>
                <View style={utilSpacing.ml3}>
                  <Text style={utilSpacing.mb3} preset="bold" text="Chef Name"></Text>
                  <Text style={utilSpacing.mb3} caption text="3 articulos - Q100"></Text>
                  <Text caption text="en curso"></Text>
                  <Text caption text="Sab, 3 de mayo 1pm a 3pm"></Text>
                </View>
              </View>
            </Card>
            <Card style={[utilSpacing.mx4, utilSpacing.mt4, utilSpacing.p4]}>
              <View style={utilFlex.flexRow}>
                <View>
                  <AutoImage source={images.chef1} style={styles.chefImage}></AutoImage>
                  <Text caption style={[utilFlex.selfCenter, utilSpacing.mt3]} text="#23423"></Text>
                </View>
                <View style={utilSpacing.ml3}>
                  <Text style={utilSpacing.mb3} preset="bold" text="Chef Name"></Text>
                  <Text style={utilSpacing.mb3} caption text="3 articulos - Q100"></Text>
                  <Text caption text="en curso"></Text>
                  <Text caption text="Sab, 3 de mayo 1pm a 3pm"></Text>
                </View>
              </View>
            </Card>
          </View>
        ) : (
          <View>
            <Card style={[utilSpacing.mx4, utilSpacing.mt4, utilSpacing.p4]}>
              <View style={utilFlex.flexRow}>
                <View>
                  <AutoImage source={images.chef1} style={styles.chefImage}></AutoImage>
                  <Text caption style={[utilFlex.selfCenter, utilSpacing.mt3]} text="#23423"></Text>
                </View>
                <View style={utilSpacing.ml3}>
                  <Text style={utilSpacing.mb3} preset="bold" text="Chef Name"></Text>
                  <Text style={utilSpacing.mb3} caption text="3 articulos - Q100"></Text>

                  <Text caption text="Sab, 3 de mayo 1pm a 3pm"></Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  chefImage: {
    borderRadius: spacing[2],
    height: 100,
    width: 100,
  },
  container: {
    backgroundColor: color.background,
  },
  segmentedControl: {
    height: 40,
  },
})
