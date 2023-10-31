import React, { useState } from "react"
import {
  ImageProps as DefaultImageProps,
  ImageURISource,
  Image as RNImage,
  StyleProp,
  StyleSheet,
} from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"
import images from "../../assets/images"

type ImageProps = DefaultImageProps & {
  source: ImageURISource
  style: StyleProp<ImageStyle>
}

export function Image(props: ImageProps) {
  const [imageError, setImageError] = useState(false)
  if ((!props.source && !props.source.uri) || props.source?.uri?.trim() === "" || imageError) {
    return (
      <RNImage {...props} source={images.placeholder} style={[styles.placeholder, props.style]} />
    )
  }

  if (props.source?.uri?.length > 0) {
    const style = [styles.image, props.style]
    return (
      <FastImage
        source={{
          uri: props.source.uri,
          priority: FastImage.priority.normal,
        }}
        style={style}
        onError={() => {
          setImageError(true)
        }}
      />
    )
  } else if (!props.source?.uri)
    return <RNImage {...props} source={props.source} style={props.style} />

  return null
}

const styles = StyleSheet.create({
  image: {
    // backgroundColor: "#eee",
  },
  placeholder: {
    width: "100%",
  },
})
