import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { getMaskCard, getMaskCVV, getMaskLength } from "../../utils/mask"
import { InputText } from "../input-text/input-text"

export interface PaymentCardProps {
  /**
   * Methods from FormProvider
   */
  methods: any
}

/**
 * Inputs for payment card
 */
export const PaymentCard = function PaymentCard(props: PaymentCardProps) {
  const { methods } = props
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
    <View>
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
        ></InputText>
      </View>
    </View>
  )
}
