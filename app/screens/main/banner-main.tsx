import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, View } from "react-native"
import images from "../../assets/images"
import { Button, Card, Image, Text } from "../../components"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import { palette } from "../../theme/palette"

const BannerMain = () => {
  const navigation = useNavigation()
  return (
    <Card style={[utilFlex.flex, utilFlex.flexRow, utilSpacing.m4, styles.banner]}>
      <View style={[utilFlex.flex1, utilSpacing.py3, utilSpacing.pl2, utilSpacing.mr2]}>
        <View style={[styles.tag, utilSpacing.px3, utilSpacing.py2]}>
          <Text style={utilText.textWhite} preset="bold" tx="mainScreen.new"></Text>
        </View>

        <Text preset="semiBold" size="lg" style={utilSpacing.mt3} tx="mainScreen.eatHealthy"></Text>
        <Text style={utilSpacing.mt4} preset="semiBold" tx="mainScreen.testDish"></Text>
        <Button
          tx="mainScreen.requestDish"
          block
          textStyle={[utilSpacing.px2]}
          style={[utilSpacing.mt5, utilSpacing.px1, utilSpacing.py3]}
          onPress={() => navigation.navigate("subscription" as never)}
        ></Button>
      </View>

      <View style={[utilFlex.flex, utilFlex.flexCenterVertical]}>
        <Image style={styles.image} source={images.dishes}></Image>
        <Image style={styles.imageLeaves} source={images.leaves}></Image>
      </View>
      <View style={styles.circle}></View>
    </Card>
  )
}

export default BannerMain

const styles = StyleSheet.create({
  banner: {
    overflow: "hidden",
    position: "relative",
  },
  circle: {
    backgroundColor: palette.green200,
    borderRadius: 300,
    height: 300,
    position: "absolute",
    right: -150,
    top: -115,
    width: 300,
    zIndex: -2,
  },
  image: {
    height: 120,
    right: 10,
    width: 120,
  },
  imageLeaves: {
    height: 145,
    position: "absolute",
    right: -110,
    width: 145,
    zIndex: -1,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.green,
    borderRadius: spacing[2],
    display: "flex",
    flexDirection: "row",
  },
})
