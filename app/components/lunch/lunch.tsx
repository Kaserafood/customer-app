import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import Ripple from "react-native-material-ripple"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Icon } from "../icon/icon"
import { Image } from "../image/image"
import { Text } from "../text/text"

interface Props {
  id: number
  name: string
  description: string
  image: string
  features: {
    label: string
    value: number
  }[]
  credits: number
  showButtons?: boolean
  onPress?: () => void
  onPressButton?: (id: number, quantity: number, totalCredits: number) => void
  totalCredits?: number
  quantity?: number
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

const Lunch = observer(
  ({
    id,
    name,
    description,
    features,
    image,
    showButtons,
    credits,
    onPress,
    onPressButton,
    totalCredits: totalCreditsProp,
    quantity: quantityProp,
    style,
  }: Props) => {
    const { cartStore, plansStore } = useStores()
    const [totalCredits, setTotalCredits] = useState(totalCreditsProp || 0)

    const [quantity, setQuantity] = useState(quantityProp || 0)

    const handleButton = (quantity: number, totalCredits: number) => {
      setQuantity(quantity)
      setTotalCredits(totalCredits)
      onPressButton(id, quantity, totalCredits)
    }

    const enoughCredits = () => {
      if (plansStore.totalCredits - cartStore.useCredits - credits < 0) {
        return false
      }
      return true
    }

    return (
      <View>
        <Ripple
          rippleOpacity={0}
          rippleDuration={400}
          style={[
            utilFlex.flexRow,
            utilSpacing.px5,
            utilSpacing.py4,
            style,
            showButtons && styles.paddingBottom,
          ]}
          onPress={onPress}
        >
          {!!image && (
            <Image
              resizeMode="cover"
              style={[styles.image, utilSpacing.mr4]}
              source={{ uri: image }}
            ></Image>
          )}

          <View style={[utilFlex.flex1, utilFlex.felxColumn]}>
            <View>
              <Text text={name} preset="semiBold" numberOfLines={2} style={utilSpacing.mb2}></Text>
              <Text text={description} style={utilSpacing.mb3} numberOfLines={2}></Text>
            </View>

            <View style={[utilFlex.flex1, utilFlex.flexRow, styles.containerTags]}>
              {features?.map((tag) => (
                <View
                  key={tag.value}
                  style={[
                    styles.tag,
                    utilSpacing.px4,
                    utilSpacing.py2,
                    utilSpacing.mr2,
                    utilSpacing.mb2,
                  ]}
                >
                  <Text text={tag.label}></Text>
                </View>
              ))}
            </View>
          </View>
        </Ripple>
        {showButtons && (
          <View style={[utilFlex.flexRow, styles.containerTotal]}>
            <View
              style={[
                utilFlex.flex1,
                utilFlex.flexCenterVertical,
                styles.containerCredits,
                utilSpacing.pr3,
              ]}
            >
              <View style={utilFlex.flexRow}>
                <Text text={`${credits} `} preset="semiBold"></Text>
                <Text
                  preset="semiBold"
                  tx={credits === 1 ? "lunch.credit" : "lunch.credits"}
                ></Text>
              </View>
            </View>

            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, styles.containerButtons]}>
              <TouchableOpacity
                style={[utilSpacing.p5, quantity === 0 && styles.disabled]}
                onPress={() => {
                  handleButton(quantity - 1, totalCredits - credits)
                }}
                disabled={quantity === 0}
              >
                <View style={[styles.btn, utilSpacing.p3]}>
                  <Icon name="minus" size={12} color={color.palette.white}></Icon>
                </View>
              </TouchableOpacity>
              <View style={[styles.total, utilSpacing.mx3, utilFlex.flexCenter]}>
                <Text>{quantity}</Text>
              </View>

              <TouchableOpacity
                style={[
                  utilSpacing.p5,
                  (!cartStore.hasCredits || !enoughCredits()) && styles.disabled,
                ]}
                onPress={() => {
                  handleButton(quantity + 1, totalCredits + credits)
                }}
                disabled={!cartStore.hasCredits || !enoughCredits()}
              >
                <View style={[styles.btn, utilSpacing.p3]}>
                  <Icon name="plus" size={12} color={color.palette.white}></Icon>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  btn: {
    backgroundColor: color.primary,
    borderRadius: spacing[2],
  },
  containerButtons: {
    alignSelf: "flex-end",
  },
  containerCredits: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  containerTags: {
    display: "flex",
    flexWrap: "nowrap",
    // minHeight: 32,
    overflow: "hidden",
  },
  containerTotal: {
    bottom: 0,
    position: "absolute",
    // right: spacing[5],
  },
  credit: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.greenLight,
    borderRadius: spacing[2],
    display: "flex",
  },
  disabled: {
    opacity: 0.5,
  },
  image: {
    borderRadius: spacing[3],
    height: 105,
    width: 140,
  },
  paddingBottom: {
    paddingBottom: 50,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.white,
    borderColor: color.palette.gray300,
    borderRadius: spacing[5],
    borderWidth: 1,
  },
  total: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[2],
    borderWidth: 1,
    height: 25,
    minWidth: 40,
    textAlign: "center",
  },
})

export default Lunch
