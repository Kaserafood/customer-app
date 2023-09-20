import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Ripple from "react-native-material-ripple"

import images from "../../assets/images"
import { Button, Card, Icon, Image, Text } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { getImageByTypeCard } from "../../utils/image"

interface SelectPaymentMethodProps {
  openPaymentList: (openModalAdd?: boolean) => void
  isPlan?: boolean
}

const SelectPaymentMethod = ({ openPaymentList, isPlan }: SelectPaymentMethodProps) => {
  const { userStore } = useStores()

  return (
    <View>
      <Text
        preset="bold"
        size="lg"
        tx="checkoutScreen.paymentMethod"
        style={[utilSpacing.mb2, utilSpacing.mx4]}
      ></Text>

      {isPlan && !userStore.currentCard?.id ? (
        <View style={[utilSpacing.mx4, utilSpacing.mb4, utilSpacing.mt2, utilFlex.selfCenter]}>
          <Button
            tx="checkoutScreen.addPaymentMethod"
            preset="white"
            style={[styles.btnPaymentMethod, utilSpacing.py2]}
            textStyle={{ color: palette.green }}
            onPress={() => openPaymentList(true)}
          ></Button>
        </View>
      ) : (
        <Card style={[styles.containerPayment, utilSpacing.m4, utilSpacing.px1, utilSpacing.p0]}>
          {userStore.currentCard?.id ? (
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => {
                openPaymentList()
              }}
              style={[
                utilSpacing.p2,
                utilSpacing.py3,
                utilFlex.flexRow,
                utilFlex.flexCenterVertical,
              ]}
            >
              <View style={[utilFlex.flex1, utilSpacing.ml4]}>
                <Text text={userStore.currentCard.name} preset="semiBold"></Text>
                <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                  <Text
                    text="****"
                    caption
                    size="sm"
                    style={[utilSpacing.mt2, utilSpacing.mr2]}
                  ></Text>

                  <Text text={userStore.currentCard.number} caption size="sm"></Text>
                </View>
              </View>

              <Image
                style={[styles.imageCard, utilSpacing.mr4]}
                source={getImageByTypeCard(userStore.currentCard.type as never)}
              ></Image>
              <TouchableOpacity style={[utilSpacing.px4, utilSpacing.py3, utilSpacing.mr3]}>
                <Icon name="angle-right" size={18} color={color.palette.grayDark} />
              </TouchableOpacity>
            </Ripple>
          ) : (
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              onPress={() => {
                openPaymentList()
              }}
              style={[
                utilSpacing.p2,
                utilSpacing.py3,
                utilFlex.flexRow,
                utilFlex.flexCenterVertical,
              ]}
            >
              <View style={[utilFlex.flex1, utilSpacing.ml4]}>
                <View style={utilFlex.felxColumn}>
                  <Text
                    tx="checkoutScreen.paymentCash"
                    preset="semiBold"
                    style={utilSpacing.mb1}
                  ></Text>
                  <Text tx="checkoutScreen.paymentCashDescription" caption size="sm"></Text>
                </View>
              </View>

              <Image style={[styles.imageCard, utilSpacing.mr4]} source={images.cash}></Image>
              <TouchableOpacity style={[utilSpacing.px4, utilSpacing.py3, utilSpacing.mr3]}>
                <Icon name="angle-right" size={18} color={color.palette.grayDark} />
              </TouchableOpacity>
            </Ripple>
          )}
        </Card>
      )}
    </View>
  )
}

export default SelectPaymentMethod

const styles = StyleSheet.create({
  btnPaymentMethod: {
    // NO_SHADOW,
    backgroundColor: palette.greenBackground,
    borderColor: palette.green,
    borderWidth: 1,
    color: palette.red,
    height: 40,
    width: 275,
  },

  containerPayment: {
    borderColor: palette.green,
    borderWidth: 1,
  },

  imageCard: {
    borderRadius: spacing[1],
    height: 24,
    marginLeft: spacing[1],
    width: 35,
  },
})
