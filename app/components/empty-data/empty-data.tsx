import LottieView from "lottie-react-native"
import { observer } from "mobx-react-lite"
import React from "react"
import { ImageRequireSource, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { useStores } from "../../models"
import { color, typographySize } from "../../theme"
import { Text } from "../text/text"

export interface EmptyDataProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Length data
   */

  lengthData: number

  /**
   * Text message to display
   */
  message?: string

  /**
   * Image to display
   */
  image?: ImageRequireSource
}

/**
 * Component when there is no data
 */
export const EmptyData = observer(function EmptyData(props: EmptyDataProps) {
  const { style, lengthData = -1, message, image } = props
  const { commonStore } = useStores()

  return (
    <View style={style}>
      {lengthData === 0 && !commonStore.isVisibleLoading && (
        <View>
          <LottieView
            style={styles.notFound}
            source={image || require("./notFound.json")}
            autoPlay
            loop
          />
          {message ? (
            <Text style={styles.textNotFound} text={message}></Text>
          ) : (
            <Text style={styles.textNotFound} tx="common.notFound.dishes"></Text>
          )}
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  notFound: {
    alignSelf: "center",
    display: "flex",
    height: 150,
    width: 150,
  },
  textNotFound: {
    alignSelf: "center",
    color: color.palette.grayDark,
    fontSize: typographySize.lg,
  },
})
