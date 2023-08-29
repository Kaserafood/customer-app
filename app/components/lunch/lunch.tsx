import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"
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
  showCredits?: boolean
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
    showCredits,
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

    const getLabelCredit = () => {
      if (credits === 1) {
        return `${credits} ${getI18nText("common.credit")}`
      }
      return `${credits} ${getI18nText("common.credits")}`
    }

    return (
      <View>
        <Ripple
          rippleOpacity={0.2}
          rippleDuration={400}
          style={[
            utilFlex.flexRow,
            utilSpacing.px5,
            utilSpacing.py4,
            showButtons && styles.paddingBottom,
          ]}
          onPress={onPress}
        >
          <Image resizeMode="cover" style={styles.image} source={{ uri: image }}></Image>
          <View style={[utilFlex.flex1, utilSpacing.ml4]}>
            <View>
              <Text text={name} preset="semiBold" numberOfLines={2}></Text>
              <Text text={description} style={utilSpacing.mb3} numberOfLines={2}></Text>
            </View>

            <ScrollView horizontal style={[utilFlex.flex1, utilFlex.flexRow, styles.containerTags]}>
              {features?.map((tag) => (
                <View
                  key={tag.value}
                  style={[
                    styles.tag,
                    utilSpacing.px4,
                    utilSpacing.py3,
                    utilSpacing.mr2,
                    utilSpacing.mb2,
                  ]}
                >
                  <Text text={tag.label}></Text>
                </View>
              ))}
            </ScrollView>
            {showCredits && (
              <Text
                style={[styles.credit, utilSpacing.px3, utilSpacing.py1]}
                text={getLabelCredit()}
              ></Text>
            )}
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
              {totalCredits > 0 && (
                <View style={utilFlex.flexRow}>
                  <Text text={`${totalCredits} `} preset="semiBold"></Text>
                  <Text
                    preset="semiBold"
                    tx={totalCredits === 1 ? "lunch.credit" : "lunch.credits"}
                  ></Text>
                </View>
              )}
            </View>

            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, styles.containerButtons]}>
              <TouchableOpacity
                style={[styles.btn, utilSpacing.p3, quantity === 0 && styles.disabled]}
                onPress={() => {
                  handleButton(quantity - 1, totalCredits - credits)
                }}
                disabled={quantity === 0}
              >
                <Icon name="minus" size={12} color={color.palette.white}></Icon>
              </TouchableOpacity>
              <View style={[styles.total, utilSpacing.mx3, utilFlex.flexCenter]}>
                <Text>{quantity}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.btn,
                  utilSpacing.p3,
                  (!cartStore.hasCredits || !enoughCredits()) && styles.disabled,
                ]}
                onPress={() => {
                  handleButton(quantity + 1, totalCredits + credits)
                }}
                disabled={!cartStore.hasCredits || !enoughCredits()}
              >
                <Icon name="plus" size={12} color={color.palette.white}></Icon>
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
    overflow: "hidden",
  },
  containerTotal: {
    bottom: 0,
    position: "absolute",
    right: spacing[5],
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
    paddingBottom: 38,
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
