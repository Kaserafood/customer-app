import React from "react"
import {
  Image as RNImage,
  ImageErrorEventData,
  ImageProps as DefaultImageProps,
  ImageURISource,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
} from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"

type ImageProps = DefaultImageProps & {
  source: ImageURISource
  style: StyleProp<ImageStyle>
}

export function Image(props: ImageProps) {
  const onError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (error)
      console.log("ERROR LOADING IMAGE: ", error.nativeEvent.error, ` URI : ${props.source.uri}`)
    props.source = { uri: "https://via.placeholder.com/150" }
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
        onError={() => onError(null)}
      />
    )
  } else if (!props.source?.uri)
    return <RNImage {...props} source={props.source} style={props.style} onError={onError} />

  return null
}

const styles = StyleSheet.create({
  image: {
    // backgroundColor: "#eee",
  },
})
