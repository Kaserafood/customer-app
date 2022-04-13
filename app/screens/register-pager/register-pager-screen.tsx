import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet, ImageURISource } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import PagerView from "react-native-pager-view"
import { utilSpacing, utilText } from "../../theme/Util"
import { NavigatorParamList } from "../../navigators"
import { AutoImage, Screen, Text, Button, Dot } from "../../components"
import { color } from "../../theme"
import images from "assets/images"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  justifyContent: "center",
}

interface Page {
  title: string
  description: string
  image: ImageURISource
}

export const RegisterPagerScreen: FC<
  StackScreenProps<NavigatorParamList, "registerPager">
> = observer(({ navigation }) => {
  const [page, setPage] = React.useState(0)
  let pageView = null

  useEffect(() => {
    setPage(0)
  }, [])

  const data: Array<Page> = [
    {
      title: "registerPagerScreen.page1.title",
      description: "registerPagerScreen.page1.description",
      image: images.step1,
    },
    {
      title: "registerPagerScreen.page2.title",
      description: "registerPagerScreen.page2.description",
      image: images.step2,
    },
    {
      title: "registerPagerScreen.page3.title",
      description: "registerPagerScreen.page3.description",
      image: images.step3,
    },
  ]

  const nextPage = () => {
    console.log("NEXT PAGE")
    pageView.setPage(page + 1)
    setPage(page + 1)
  }
  const toRegister = () => {
    navigation.navigate("registerForm")
  }

  return (
    <Screen
      style={ROOT}
      preset="scroll"
      statusBar="dark-content"
      statusBarBackgroundColor={color.palette.white}
    >
      <PagerView
        style={styles.pagerView}
        initialPage={page}
        ref={(c) => {
          pageView = c
        }}
        scrollEnabled={false}
      >
        {data.map((page, index) => (
          <View style={styles.page} key={index + 1}>
            <AutoImage style={styles.image} source={page.image}></AutoImage>

            <Text
              style={[utilSpacing.mb3, utilText.textCenter]}
              preset="bold"
              size="lg"
              tx={page.title}
            ></Text>

            <Text style={utilText.textCenter} tx={page.description}></Text>
          </View>
        ))}
      </PagerView>
      <View style={[styles.containerDots, utilSpacing.my6]}>
        <Dot active={page >= 0} style={utilSpacing.mr6}></Dot>
        <Dot active={page >= 1} style={utilSpacing.mr6}></Dot>
        <Dot active={page >= 2}></Dot>
      </View>

      <View style={utilSpacing.my6}>
        {page <= 1 ? (
          <View style={styles.containerButtons}>
            <Button
              tx="registerPagerScreen.skip"
              preset="white"
              style={[styles.btn, utilSpacing.mr3, utilSpacing.py5]}
              onPress={toRegister}
            ></Button>
            <Button
              onPress={nextPage}
              tx="registerPagerScreen.next"
              style={[styles.btn, utilSpacing.ml3]}
            ></Button>
          </View>
        ) : (
          <View style={styles.containerButtons}>
            <Button
              onPress={toRegister}
              tx="registerPagerScreen.next"
              style={[utilSpacing.py5, styles.btnBlock]}
              block
            ></Button>
          </View>
        )}
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  btn: {
    width: 150,
  },
  btnBlock: {
    width: "75%",
  },
  containerButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  containerDots: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    height: 210,
    margin: "auto",
    width: 210,
  },
  page: {
    alignItems: "center",

    display: "flex",
    justifyContent: "center",
  },

  pagerView: {
    alignSelf: "center",
    display: "flex",
    flex: 1,
    width: "75%",
  },
})
