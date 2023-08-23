import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Image, Text } from "../../components"
import { color } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"

interface Props {
  variant: "light" | "dark"
}

const Banner = ({ variant }: Props) => {
  const navigation = useNavigation()
  return (
    <>
      {variant === "light" ? (
        <View style={[utilFlex.flex, utilFlex.flexRow]}>
          <View style={[utilFlex.flex1, utilSpacing.py6, utilSpacing.px5]}>
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
              onPress={() => navigation.navigate("subscription" as never)}
            ></Button>
          </View>

          <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
            <Image style={styles.image} source={images.plans}></Image>
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
              onPress={() => navigation.navigate("subscription" as never)}
            ></Button>
          </View>

          <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
            <Image style={styles.image} source={images.plans}></Image>
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
  image: {
    height: 140,
    width: 140,
  },
})
