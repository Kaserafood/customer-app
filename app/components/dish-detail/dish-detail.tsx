import * as React from "react"
import { TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { spacing } from "../../theme/spacing"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

const IMAGE: ImageStyle = {
  width: "100%",
  height: 200,
  marginVertical: spacing[2],
  borderRadius: spacing[2],
}
interface Data {
  title: string
  description: string
  images: Array<string>
  tags: Array<string>
}

export interface DishDetailProps {
  data: Data
}

export const DishDetail = observer(function DishDetail(props: DishDetailProps) {
  const { title, description, images, tags } = props.data
  const lengthImages = props.data.images?.length
  return (
    <View style={CONTAINER}>
      <Text style={TEXT}>
        <Text tx="loginScreen.dish.title"></Text> {title}
      </Text>
      <Text style={TEXT}>
        <Text tx="loginScreen.dish.description"></Text> {description}
      </Text>
      <Text style={TEXT}>
        <Text tx="loginScreen.dish.tags"></Text>
        {":"}
        {tags.map((tag, index) => (
          <Text key={index}>
            {tag} {index < lengthImages ? ", " : ""}
          </Text>
        ))}
      </Text>
      <View>
        {images.map((image, index) => (
          <Image style={IMAGE} key={index} source={{ uri: image }} />
        ))}
      </View>
    </View>
  )
})
