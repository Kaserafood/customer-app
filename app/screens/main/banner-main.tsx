import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Image, Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { getI18nText } from "../../utils/translate"

const BannerMain = () => {
  const navigation = useNavigation()
  return (
    <View style={[utilFlex.flex, utilFlex.flexRow, styles.banner]}>
      <View style={[utilFlex.flex1, utilSpacing.py6, utilSpacing.pl5]}>
        <View style={[styles.tag, utilSpacing.px3, utilSpacing.py2]}>
          <Text style={utilText.textWhite} preset="bold" tx="mainScreen.new"></Text>
        </View>

        <Text preset="bold" size="lg" style={utilSpacing.mt3} tx="mainScreen.eatHealthy"></Text>
        <Text style={utilSpacing.mt4} tx="mainScreen.testDish"></Text>
        <Button
          tx="mainScreen.requestDish"
          block
          textStyle={[utilSpacing.px2]}
          style={[utilSpacing.mt4, utilSpacing.px1, utilSpacing.py3]}
          onPress={() => navigation.navigate(getI18nText("tabMainNavigation.packages") as never)}
        ></Button>
      </View>

      <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
        <Image style={styles.image} source={images.lunchHome}></Image>
      </View>
    </View>
  )
}

export default BannerMain

const styles = StyleSheet.create({
  banner: {
    backgroundColor: color.palette.gray300,
  },
  image: {
    height: 161,
    width: 161,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.green,
    borderRadius: spacing[2],
    display: "flex",
    flexDirection: "row",
  },
})
