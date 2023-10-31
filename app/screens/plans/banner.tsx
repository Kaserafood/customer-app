import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Image, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"
import { useStores } from "../../models"

interface Props {
  variant: "light" | "dark"
  onShowModalCoverageCredits: () => void
}

const Banner = ({ variant, onShowModalCoverageCredits }: Props) => {
  const navigation = useNavigation()

  const { coverageStore } = useStores()

  const handleNavigate = () => {
    if (!coverageStore.hasCoverageCredits) {
      onShowModalCoverageCredits()
      return
    }

    navigation.navigate("subscription" as never)
  }

  return (
    <>
      {variant === "light" ? (
        <View style={[utilFlex.flex, utilFlex.flexRow]}>
          <View style={[utilFlex.flex1, utilSpacing.py6, utilSpacing.pl5, utilSpacing.pr2]}>
            <Text
              preset="bold"
              size="lg"
              style={utilSpacing.mt3}
              tx="mainScreen.lunchHealthy"
            ></Text>
            <Text style={utilSpacing.mt4} tx="mainScreen.forgetCook"></Text>
            <Button
              tx="mainScreen.seeMenuAndPrices"
              block
              style={[utilSpacing.mt6, utilSpacing.px2, utilSpacing.py4]}
              onPress={handleNavigate}
            ></Button>
          </View>

          <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
            <Image style={[styles.image, utilSpacing.mr6]} source={images.dishes}></Image>
            <View style={styles.circle}></View>
            <Image style={styles.imageLeaves} source={images.leaves}></Image>
          </View>
        </View>
      ) : (
        <View style={[utilFlex.flex, utilFlex.flexRow, styles.bgDark]}>
          <View style={[utilFlex.flex1, utilSpacing.py6, utilSpacing.px5]}>
            <Text
              preset="bold"
              size="lg"
              style={[utilSpacing.mt3, utilText.textWhite]}
              tx="mainScreen.youAreNotReady"
            ></Text>
            <Text
              style={[utilSpacing.mt4, utilText.textWhite]}
              tx="mainScreen.testFirstLunch"
            ></Text>
            <Button
              tx="mainScreen.iWantTest"
              block
              style={[utilSpacing.mt6, utilSpacing.px2, utilSpacing.py4]}
              onPress={handleNavigate}
            ></Button>
          </View>

          <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
            <Image style={[styles.image, utilSpacing.mr6]} source={images.dishes}></Image>
          </View>
        </View>
      )}
    </>
  )
}

export default Banner

const styles = StyleSheet.create({
  bgDark: {
    backgroundColor: color.palette.black,
  },
  circle: {
    backgroundColor: palette.green200,
    borderRadius: 300,
    height: 300,
    position: "absolute",
    right: -150,
    top: -75,
    width: 300,
    zIndex: -1,
  },
  image: {
    height: 125,
    width: 125,
  },
  imageLeaves: {
    height: 145,
    position: "absolute",
    right: -95,
    width: 145,
    zIndex: -1,
  },
  imageLeavesDark: {
    height: 200,
    position: "absolute",
    right: -90,
    width: 200,
    zIndex: -1,
  },
})
