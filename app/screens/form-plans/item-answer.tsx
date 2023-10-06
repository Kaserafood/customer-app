import React from "react"
import { StyleSheet } from "react-native"
import Ripple from "react-native-material-ripple"
import { Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilSpacing, utilText } from "../../theme/Util"

interface Props {
  label: string
  value: string
  onPress: () => void
  isSelected: boolean
  disabled?: boolean
}

const ItemAnswer = ({ label, value, onPress, isSelected, disabled }: Props) => {
  return (
    <Ripple
      style={[
        styles.btn,
        utilSpacing.px5,
        utilSpacing.py4,
        utilSpacing.mr3,
        utilSpacing.mb3,
        isSelected && styles.active,
        disabled && styles.disabled,
      ]}
      rippleOpacity={0.2}
      rippleDuration={400}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        text={label}
        style={[isSelected && utilText.textWhite, disabled && utilText.textGray]}
      ></Text>
    </Ripple>
  )
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  btn: {
    backgroundColor: color.palette.gray300,
    borderColor: color.palette.gray300,
    borderRadius: spacing[3],
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: color.palette.grayDisabled,
    borderColor: color.palette.whiteGray,
    borderWidth: 1,
  },
})

export default ItemAnswer
