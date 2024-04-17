import React from "react"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { spacing } from "../../theme"

const SkeletonCategories = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={"100%"} flexDirection="row" marginVertical={spacing[2]}>
        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      <SkeletonPlaceholder.Item width={"100%"} flexDirection="row">
        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>

        <SkeletonPlaceholder.Item flex={1} marginHorizontal={spacing[1]}>
          <SkeletonPlaceholder.Item width={"100%"} height={108} borderRadius={16} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
}
export default SkeletonCategories
