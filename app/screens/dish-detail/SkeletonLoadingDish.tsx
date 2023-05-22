import React from "react"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { spacing } from "../../theme"

const SkeletonLoadingDish = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={"100%"} flexDirection="row" marginLeft={spacing[4]}>
        <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
          <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
          <SkeletonPlaceholder.Item marginTop={10} width={150} height={16} borderRadius={8} />
          <SkeletonPlaceholder.Item
            alignSelf="flex-end"
            marginTop={6}
            width={50}
            height={16}
            borderRadius={24}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
          <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
          <SkeletonPlaceholder.Item marginTop={10} width={150} height={16} borderRadius={8} />
          <SkeletonPlaceholder.Item
            alignSelf="flex-end"
            marginTop={6}
            width={50}
            height={16}
            borderRadius={24}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item width={150} marginRight={spacing[3]}>
          <SkeletonPlaceholder.Item width={150} height={110} borderRadius={16} />
          <SkeletonPlaceholder.Item marginTop={10} width={150} height={16} borderRadius={8} />
          <SkeletonPlaceholder.Item
            alignSelf="flex-end"
            marginTop={6}
            width={50}
            height={16}
            borderRadius={24}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  )
}

export default SkeletonLoadingDish
