import React from "react"
import { Dimensions } from "react-native"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { spacing } from "../../theme"

const windowWidth = Dimensions.get("window").width

const SkeletonBanner = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        width={"100%"}
        flexDirection="row"
        marginVertical={spacing[2]}
        marginHorizontal={spacing[3]}
      >
        <SkeletonPlaceholder.Item width={windowWidth - 75} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={165} borderRadius={20} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item width={windowWidth - 75} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={165} borderRadius={20} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
}
export default SkeletonBanner
