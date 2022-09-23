import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { StyleSheet, View } from "react-native"
import * as Animatable from "react-native-animatable"
import { Button, InputText, Modal, Text } from "../../components"
import { Coupon, useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { showMessageError } from "../../utils/messages"
import { ModalState } from "../../utils/modalState"
import { getI18nText } from "../../utils/translate"

interface ModalCouponProps {
  stateModal: ModalState
  onUseCoupon(coupon: Coupon): void
}

export const ModalCoupon = (props: ModalCouponProps) => {
  const { ...methods } = useForm({ mode: "onBlur" })
  const { commonStore, orderStore } = useStores()
  const [isValidCoupon, setIsValidCoupon] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)
  const [textCoupon, setTextCoupon] = useState("")
  const { stateModal, onUseCoupon } = props

  const onSubmit = (data) => {
    setIsSubmited(false)
    commonStore.setVisibleLoading(true)
    orderStore
      .getCoupon(data.coupon)
      .then((response) => {
        setIsSubmited(true)
        if (response && response.id > 0) {
          onUseCoupon(response)
          setIsSubmited(true)
          setIsValidCoupon(true)

          if (response.discountType === "percent") {
            const text = getI18nText("modalCoupon.discountApply", {
              percent: `${parseInt(response.amount.toString()).toString()}%`,
            })
            setTextCoupon(text)
          }
        } else setIsValidCoupon(false)
      })
      .catch((error) => {
        __DEV__ && console.log(error)
        showMessageError()
      })
      .finally(() => {
        commonStore.setVisibleLoading(false)
      })
  }
  const onError = (errors) => {
    console.log(errors)
  }

  const hide = () => {
    setIsSubmited(false)
    setIsValidCoupon(false)
    methods.reset()
    stateModal.setVisible(false)
  }

  return (
    <Modal modal={stateModal} size="md" onHide={hide}>
      <View>
        <Text
          tx="modalCoupon.title"
          size="lg"
          preset="bold"
          style={[utilSpacing.py5, utilSpacing.mb4, utilFlex.selfCenter]}
        ></Text>
        <FormProvider {...methods}>
          <InputText
            preset="card"
            name="coupon"
            placeholderTx="modalCoupon.placeholderCoupon"
            labelTx="modalCoupon.labelCoupon"
            rules={{
              required: {
                value: true,
                message: "modalCoupon.couponRequired",
              },
            }}
            autoCapitalize="characters"
          ></InputText>

          {isSubmited && (
            <View>
              {isValidCoupon ? (
                <Animatable.View animation="tada" style={utilFlex.selfCenter}>
                  <Text
                    text={textCoupon}
                    size="lg"
                    preset="bold"
                    style={[utilSpacing.my5, styles.textSuccess, utilFlex.selfCenter]}
                  ></Text>
                </Animatable.View>
              ) : (
                <Animatable.Text animation="tada" style={utilFlex.selfCenter}>
                  <Text
                    size="lg"
                    preset="bold"
                    tx="modalCoupon.couponInvalid"
                    style={[utilSpacing.my5, styles.textError, utilFlex.selfCenter]}
                  ></Text>
                </Animatable.Text>
              )}
            </View>
          )}

          {isValidCoupon ? (
            <Button
              tx="common.ready"
              style={[utilSpacing.mb4, utilSpacing.mt5, utilFlex.selfCenter]}
              onPress={hide}
            ></Button>
          ) : (
            <Button
              tx="modalCoupon.use"
              style={[utilSpacing.mb4, utilSpacing.mt5, utilFlex.selfCenter]}
              onPress={methods.handleSubmit(onSubmit, onError)}
            ></Button>
          )}
        </FormProvider>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  textError: {
    color: color.palette.redDark,
  },
  textSuccess: {
    color: color.palette.green,
  },
})
