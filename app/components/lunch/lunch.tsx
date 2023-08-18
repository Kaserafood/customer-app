import React, { useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { Icon } from "../icon/icon"
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
  showButtons?: boolean
}

const Lunch = ({ name, description, tags, image, showButtons }: Props) => {
  const [total, setTotal] = useState(0)

  return (
    <View style={utilFlex.flexRow}>
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

        {showButtons && (
          <View style={utilFlex.flexRow}>
            <View style={[utilFlex.flex1, utilFlex.flexCenterVertical]}>
              {total > 0 && (
                <View style={utilFlex.flexRow}>
                  <Text text={`${total} `}></Text>
                  <Text tx={total === 1 ? "lunch.credit" : "lunch.credits"}></Text>
                </View>
              )}
            </View>

            <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, styles.containerButtons]}>
              <TouchableOpacity
                style={[styles.btn, utilSpacing.p3]}
                onPress={() => setTotal(total - 1)}
                disabled={total === 0}
              >
                <Icon name="minus" size={12} color={color.palette.white}></Icon>
              </TouchableOpacity>
              <View style={[styles.total, utilSpacing.mx3, utilFlex.flexCenter]}>
                <Text>{total}</Text>
              </View>

              <TouchableOpacity
                style={[styles.btn, utilSpacing.p3]}
                onPress={() => setTotal(total + 1)}
              >
                <Icon name="plus" size={12} color={color.palette.white}></Icon>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: color.primary,
    borderRadius: spacing[2],
  },
  containerButtons: {
    alignSelf: "flex-end",
  },
  containerTags: {
    display: "flex",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  image: {
    borderRadius: spacing[3],
    height: 105,
    width: 140,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: color.palette.white,
    borderColor: color.palette.gray300,
    borderRadius: spacing[5],
    borderWidth: 1,
  },
  total: {
    borderColor: color.palette.gray300,
    borderRadius: spacing[2],
    borderWidth: 1,
    height: 25,
    minWidth: 40,
    textAlign: "center",
  },
})

export default Lunch
