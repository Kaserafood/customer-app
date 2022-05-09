import LottieView from "lottie-react-native"
import { observer } from "mobx-react-lite"
import React, { useLayoutEffect, useState } from "react"
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
  const { style, lengthData, message, image } = props

  const [notFound, setNotFound] = useState(false)
  const { commonStore } = useStores()

  useLayoutEffect(() => {
    if (lengthData === 0) {
      setNotFound(true)
    }
  }, [lengthData])

  return (
    <View style={style}>
      {notFound && !commonStore.isVisibleLoading && (
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
