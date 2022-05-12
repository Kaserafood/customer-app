import React from "react"
import {
  Image as RNImage,
  ImageErrorEventData,
  ImageProps as DefaultImageProps,
  ImageURISource,
  NativeSyntheticEvent,
  StyleProp,
} from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"

type ImageProps = DefaultImageProps & {
  source: ImageURISource
  style: StyleProp<ImageStyle>
}

/**
 * An Image wrapper component that autosizes itself to the size of the actual image.
 * You can always override by passing a width and height in the style.
 * If passing only one of width/height this image component will use the actual
 * size of the other dimension.
 *
 * This component isn't required, but is provided as a convenience so that
 * we don't have to remember to explicitly set image sizes on every image instance.
 *
 * To use as a stand-in replacement import { AutoImage as Image } and remove the
 * Image import from react-native. Now all images in that file are handled by this
 * component and are web-ready if not explicitly sized in the style property.
 */
export function AutoImage(props: ImageProps) {
  const onError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (error)
      console.log("ERROR LOADING IMAGE: ", error.nativeEvent.error, ` URI : ${props.source.uri}`)
    props.source = { uri: "https://via.placeholder.com/150" }
  }

  if (props.source?.uri?.length > 0) {
    return (
      <FastImage
        source={{
          uri: props.source.uri,
          priority: FastImage.priority.normal,
        }}
        style={props.style}
        onError={() => onError(null)}
      />
    )
  }
  if (!props.source?.uri)
    return <RNImage {...props} source={props.source} style={props.style} onError={onError} />

  return null
}
