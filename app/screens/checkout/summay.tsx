import React from "react"
import { StyleSheet } from "react-native"
import { Card, Separator } from "../../components"
import { spacing } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import { DishesList } from "./dishes-list"
import { Totals } from "./totals"

interface Props {
  priceDelivery: number
}

const Summary = ({ priceDelivery }: Props) => {
  return (
    <>
      <Card style={[utilSpacing.p5, utilSpacing.mb6]}>
        <DishesList></DishesList>
        <Separator style={styles.separator}></Separator>
        <Totals priceDelivery={priceDelivery}></Totals>
      </Card>
    </>
  )
}
const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginVertical: spacing[3],
  },
})

export default Summary
