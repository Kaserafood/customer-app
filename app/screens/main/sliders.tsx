import React, { FC, useEffect, useRef, useState } from "react"
import { Linking, StyleSheet, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Ripple from "react-native-material-ripple"
import PagerView from "react-native-pager-view"
import { useQuery } from "react-query"
import { Button, Dot, Icon, Image, Text } from "../../components"
import { useStores } from "../../models"
import { navigate } from "../../navigators"
import { Api } from "../../services/api"
import { color } from "../../theme"
import { utilSpacing, utilText } from "../../theme/Util"
import { getInstanceMixpanel } from "../../utils/mixpanel"

interface Props {
  onWithoutCoverage: () => void
}

const api = new Api()
const mixpanel = getInstanceMixpanel()

const Sliders: FC<Props> = ({ onWithoutCoverage }) => {
  const [page, setPage] = useState(0)
  const [data, setData] = useState([])
  const { coverageStore, messagesStore, userStore } = useStores()
  const pageView = useRef<any>()

  useEffect(() => {
    pageView.current.setPage(0)
    setPage(0)
  }, [])

  useQuery("get-main-banners", () => api.getMainBanners(userStore.userId), {
    onSuccess: (data: any) => {
      setData(data.data)
    },
    onError: () => {
      messagesStore.showError()
    },
  })

  useEffect(() => {
    if (pageView && data?.length > 0) {
      const interval = setInterval(() => {
        setPage((prevPage) => (prevPage + 1) % data.length)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [pageView, data])

  useEffect(() => {
    pageView.current.setPage(page)
  }, [page])

  const handleSlide = (url: string, name: string, image: string) => {
    if (url === "kasera://plans") {
      handleCoveragePlans(image)
      return
    }

    if (url) {
      mixpanel.track("Banner press", {
        type: "main",
        name,
        image,
      })
      Linking.openURL(url)
    }
  }

  const handleCoveragePlans = (image: string) => {
    if (!coverageStore.hasCoverageCredits) {
      onWithoutCoverage()
      return
    }
    mixpanel.track("Banner press", {
      type: "main",
      name: "Plans",
      image,
    })
    navigate("plans", { showBackIcon: true })
  }
  return (
    <View style={[utilSpacing.px5, styles.container]}>
      <PagerView
        style={styles.pagerView}
        initialPage={page}
        ref={pageView}
        scrollEnabled={true}
        overdrag
        transitionStyle="scroll"
        onPageSelected={(e) => {
          setPage(e.nativeEvent.position)
        }}
      >
        {data.map((page, index) => (
          <Ripple
            key={index + 1}
            style={styles.item}
            onPress={() => handleSlide(page.url, page.name, page.image)}
          >
            <Image resizeMode="cover" style={styles.image} source={{ uri: page.image }}></Image>
            {!!page.name && (
              <LinearGradient colors={["rgba(0, 0, 0, 0)", "#212121"]} style={styles.bgName}>
                <Text
                  text={page.name}
                  preset="bold"
                  style={[utilText.textWhite, utilSpacing.px6, styles.itemName]}
                ></Text>

                <Button
                  size="sm"
                  text="Ver"
                  preset="white"
                  style={[utilSpacing.mb6, utilSpacing.ml6, styles.itemButton]}
                  iconRight={
                    <Icon
                      name="arrow-forward-outline"
                      type="Ionicons"
                      size={22}
                      color={color.text}
                    ></Icon>
                  }
                ></Button>
              </LinearGradient>
            )}
          </Ripple>
        ))}
      </PagerView>
      <View style={[styles.containerDots, utilSpacing.my4]}>
        {data.map((item, index) => (
          <Dot
            key={index}
            active={page === index}
            style={index !== data.length - 1 ? utilSpacing.mr3 : {}}
          />
        ))}
      </View>
    </View>
  )
}

export default Sliders

const styles = StyleSheet.create({
  bgName: {
    borderBottomEndRadius: 16,
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  containerDots: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    borderRadius: 16,
    height: 200,
    width: "100%",
  },
  item: { borderRadius: 16, overflow: "hidden" },

  // eslint-disable-next-line react-native/no-color-literals
  itemButton: { backgroundColor: "rgba(255,255,255,.85)", width: 80 },
  itemName: {
    fontSize: 24,
  },
  pagerView: {
    alignSelf: "center",
    display: "flex",
    flex: 1,
    height: 200,
    width: "100%",
  },
})
