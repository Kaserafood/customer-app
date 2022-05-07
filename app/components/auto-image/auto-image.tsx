import React, { useState } from "react"
import { Image as RNImage, ImageProps as DefaultImageProps, ImageURISource } from "react-native"
import images from "../../assets/images"

type ImageProps = DefaultImageProps & {
  source: ImageURISource
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
  const [errorLoad, setErrorLoad] = useState(false)

  if (props.source && !errorLoad) {
    if (props.source?.uri && !props.source?.uri?.includes("http")) setErrorLoad(true)
  }

  return (
    <RNImage
      {...props}
      source={!errorLoad ? props.source : images.category}
      style={props.style}
      onError={() => setErrorLoad(true)}
    />
  )
}
