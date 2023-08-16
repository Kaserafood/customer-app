import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Card } from "../card/card"
import { Image } from "../image/image"
import { Text } from "../text/text"

interface Props {
  name: string
  description: string
  image: string
  tags: {
    label: string
    value: string
  }[]
}

const Lunch = ({ name, description, tags, image }: Props) => {
  return (
    <Card style={[utilFlex.flexRow, utilSpacing.p4, utilSpacing.mb5]}>
      <Image resizeMode="cover" style={styles.image} source={{ uri: image }}></Image>
      <View style={[utilFlex.flex1, utilSpacing.ml4]}>
        <View>
          <Text text={name} preset="semiBold" numberOfLines={2}></Text>
          <Text text={description} style={utilSpacing.mb3} numberOfLines={2}></Text>
        </View>

        <ScrollView horizontal style={[utilFlex.flex1, utilFlex.flexRow, styles.containerTags]}>
          {tags.map((tag) => (
            <View
              key={tag.value}
              style={[
                styles.tag,
                utilSpacing.px4,
                utilSpacing.py3,
                utilSpacing.mr2,
                utilSpacing.mb2,
              ]}
            >
              <Text text={tag.label}></Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  containerTags: {
    display: "flex",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  image: {
    borderRadius: spacing[3],
    height: 110,
    width: 150,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.white,
    borderColor: color.palette.gray300,
    borderRadius: spacing[5],
    borderWidth: 1,
  },
})

export default Lunch
