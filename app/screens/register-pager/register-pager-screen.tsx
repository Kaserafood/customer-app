import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { AutoImage, Screen, Text, Button, Dot } from "../../components"

import { color } from "../../theme"
import PagerView from "react-native-pager-view"

import { utilSpacing, utilText } from "../../theme/Util"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  justifyContent: "center",
}

interface Page {
  title: string
  description: string
  image: string
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
      image: "./page1.png",
    },
    {
      title: "registerPagerScreen.page2.title",
      description: "registerPagerScreen.page2.description",
      image: "./page2.png",
    },
    {
      title: "registerPagerScreen.page3.title",
      description: "registerPagerScreen.page3.description",
      image: "./page3.png",
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
            {index === 0 && (
              <AutoImage style={styles.image} source={require("./page1.png")}></AutoImage>
            )}

            {index === 1 && (
              <AutoImage style={styles.image} source={require("./page2.png")}></AutoImage>
            )}

            {index === 2 && (
              <AutoImage style={styles.image} source={require("./page3.png")}></AutoImage>
            )}

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
              preset={page === 0 ? "gray" : "primary"}
              style={[styles.btn, utilSpacing.mr3, utilSpacing.py5]}
              onPress={toRegister}
            ></Button>
            <Button
              onPress={nextPage}
              tx="registerPagerScreen.next"
              style={[styles.btn, utilSpacing.ml3, utilSpacing.py5]}
            ></Button>
          </View>
        ) : (
          <View style={styles.containerButtons}>
            <Button
              onPress={toRegister}
              tx="registerPagerScreen.start"
              style={[styles.btn, utilSpacing.py5]}
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
