import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getMaskCard, getMaskCVV, getMaskLength } from "../../utils/mask"
import { InputText } from "../input-text/input-text"

export interface PaymentCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Methods from FormProvider
   */
  methods: any
}

/**
 * Describe your component here
 */
export const PaymentCard = observer(function PaymentCard(props: PaymentCardProps) {
  const { style, methods } = props
  const [maskCard, setMaskCard] = useState("")
  const [maskCVV, setMaskCVV] = useState("")
  const [placeholderCVV, setPlaceholderCVV] = useState("paymentCard.cvvPlaceholder3")

  const watchCardNumber = methods.watch("number")

  useEffect(() => {
    const maskCVV = getMaskCVV(`${methods.getValues("number")}`)
    setMaskCard(getMaskCard(`${methods.getValues("number")}`))
    setMaskCVV(maskCVV)

    if (getMaskLength(maskCVV) === 4) {
      setPlaceholderCVV("paymentCard.cvvPlaceholder4")
    } else {
      setPlaceholderCVV("paymentCard.cvvPlaceholder3")
    }
  }, [watchCardNumber])

  return (
    <View style={style}>
      <InputText
        name="name"
        preset="card"
        placeholderTx="paymentCard.namePlaceholder"
        rules={{
          required: "paymentCard.nameRequired",
        }}
        labelTx="paymentCard.name"
        styleContainer={[utilSpacing.my3]}
        maxLength={50}
        value="Name card"
      ></InputText>

      <InputText
        name="number"
        preset="card"
        placeholderTx="paymentCard.numberPlaceholder"
        rules={{
          required: "paymentCard.numberRequired",
          minLength: {
            value: getMaskLength(maskCard),
            message: "paymentCard.numberMinLength",
          },
        }}
        labelTx="paymentCard.number"
        styleContainer={[utilSpacing.my3]}
        maxLength={100}
        keyboardType="numeric"
        mask={maskCard}
        value="4000 1234 5678 9010"
      ></InputText>

      <View style={utilFlex.flexRow}>
        <InputText
          name="expirationDate"
          preset="card"
          placeholderTx="paymentCard.expirationDatePlaceholder"
          rules={{
            required: "paymentCard.expirationDateRequired",
          }}
          labelTx="paymentCard.expirationDate"
          styleContainer={[utilSpacing.my3, utilSpacing.mr2, utilFlex.flex1]}
          mask="[00]/[00]"
          keyboardType="numeric"
          value="12/22"
        ></InputText>

        <InputText
          name="cvv"
          preset="card"
          placeholderTx={placeholderCVV}
          rules={{
            required: "paymentCard.cvvRequired",
          }}
          labelTx="paymentCard.cvv"
          styleContainer={[utilSpacing.my3, utilSpacing.ml2, utilFlex.flex1]}
          mask={maskCVV}
          keyboardType="numeric"
          value="123"
        ></InputText>
      </View>
    </View>
  )
})
