import { observer } from "mobx-react-lite"
import React from "react"
import { ImageRequireSource, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import images from "../../assets/images"
import { useStores } from "../../models"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Image } from "../image/image"
import { Button } from "../button/button"
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

  /**
   * Callback when user click on button Request dish
   */
  onPressRequestDish?: () => void
}

/**
 * Component when there is no data
 */
export const EmptyData = observer(function EmptyData(props: EmptyDataProps) {
  const { style, lengthData = -1, message, onPressRequestDish } = props
  const { commonStore, userStore } = useStores()

  return (
    <>
      <View style={style}>
        {lengthData === 0 && !commonStore.isVisibleLoading && userStore.userId > 0 && (
          <View>
            <Image resizeMode="contain" style={styles.imgNotFound} source={images.soup}></Image>
            {message ? (
              <Text style={styles.textNotFound} text={message}></Text>
            ) : (
              <View style={styles.contianerText}>
                <Text
                  caption
                  style={[styles.textNotFound, utilSpacing.pb3, utilSpacing.mt7]}
                  tx="common.notFound.dishes"
                ></Text>
                <Text
                  preset="semiBold"
                  size="lg"
                  tx="common.notFound.tellUsWhatNeed"
                  style={[utilSpacing.py4, styles.textNotFound]}
                ></Text>
                <View style={utilFlex.flex1}>
                  <Button
                    onPress={onPressRequestDish}
                    block
                    style={utilSpacing.my6}
                    tx="modalRequestDish.requestDish"
                  ></Button>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  contianerText: {
    alignSelf: "center",
    minWidth: 300,
    width: "80%",
  },
  imgNotFound: {
    alignSelf: "center",
    height: 200,
    width: "100%",
  },
  textNotFound: {
    alignSelf: "center",
    lineHeight: 30,
  },
})
