import { StyleSheet, ViewStyle } from "react-native"
import { color } from "./color"
import { spacing } from "./spacing"
import { typography } from "./typography"
export const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export const SHADOW: ViewStyle = {
  shadowColor: color.palette.grayDark,
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.46,
  shadowRadius: 11.14,

  elevation: 7,
}

export const NO_SHADOW: ViewStyle = {
  shadowColor: color.transparent,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
}

export const utilText = StyleSheet.create({
  bold: { fontFamily: typography.primaryBold },
  marginNegative: {
    marginBottom: -4,
  },
  semiBold: { fontFamily: typography.primarySemiBold },

  textCenter: {
    textAlign: "center",
  },

  textGray: {
    color: color.palette.grayDark,
  },
})

export const utilFlex = StyleSheet.create({
  flex: {
    display: "flex",
  },
  flex1: {
    display: "flex",
    flex: 1,
  },
  flexCenter: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  flexCenterHorizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  flexCenterVertical: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },

  flexRow: {
    display: "flex",
    flexDirection: "row",
  },

  flexWrap: {
    display: "flex",
    flexWrap: "wrap",
  },
  selfCenter: {
    alignSelf: "center",
    display: "flex",
  },
})

export const utilSpacing = StyleSheet.create({
  m0: {
    margin: 0,
  },
  m1: {
    margin: spacing[0],
  },
  m2: {
    margin: spacing[1],
  },
  m3: {
    margin: spacing[2],
  },
  m4: {
    margin: spacing[3],
  },
  m5: {
    margin: spacing[4],
  },
  m6: {
    margin: spacing[5],
  },
  m7: {
    margin: spacing[6],
  },
  m8: {
    margin: spacing[7],
  },
  m9: {
    margin: spacing[8],
  },
  mb1: {
    marginBottom: spacing[0],
  },
  mb2: {
    marginBottom: spacing[1],
  },
  mb3: {
    marginBottom: spacing[2],
  },
  mb4: {
    marginBottom: spacing[3],
  },
  mb5: {
    marginBottom: spacing[4],
  },
  mb6: {
    marginBottom: spacing[5],
  },
  mb7: {
    marginBottom: spacing[6],
  },
  mb8: {
    marginBottom: spacing[7],
  },
  mb9: {
    marginBottom: spacing[8],
  },
  ml1: {
    marginLeft: spacing[0],
  },
  ml2: {
    marginLeft: spacing[1],
  },
  ml3: {
    marginLeft: spacing[2],
  },
  ml4: {
    marginLeft: spacing[3],
  },
  ml5: {
    marginLeft: spacing[4],
  },
  ml6: {
    marginLeft: spacing[5],
  },
  ml7: {
    marginLeft: spacing[6],
  },
  ml8: {
    marginLeft: spacing[7],
  },
  ml9: {
    marginLeft: spacing[8],
  },
  mr1: {
    marginRight: spacing[0],
  },
  mr2: {
    marginRight: spacing[1],
  },
  mr3: {
    marginRight: spacing[2],
  },
  mr4: {
    marginRight: spacing[3],
  },
  mr5: {
    marginRight: spacing[4],
  },
  mr6: {
    marginRight: spacing[5],
  },
  mr7: {
    marginRight: spacing[6],
  },
  mr8: {
    marginRight: spacing[7],
  },
  mr9: {
    marginRight: spacing[8],
  },
  mt1: {
    marginTop: spacing[0],
  },
  mt2: {
    marginTop: spacing[1],
  },
  mt3: {
    marginTop: spacing[2],
  },
  mt4: {
    marginTop: spacing[3],
  },
  mt5: {
    marginTop: spacing[4],
  },
  mt6: {
    marginTop: spacing[5],
  },
  mt7: {
    marginTop: spacing[6],
  },
  mt8: {
    marginTop: spacing[7],
  },
  mt9: {
    marginTop: spacing[8],
  },
  mx1: {
    marginHorizontal: spacing[0],
  },
  mx2: {
    marginHorizontal: spacing[1],
  },
  mx3: {
    marginHorizontal: spacing[2],
  },
  mx4: {
    marginHorizontal: spacing[3],
  },
  mx5: {
    marginHorizontal: spacing[4],
  },
  mx6: {
    marginHorizontal: spacing[5],
  },
  mx7: {
    marginHorizontal: spacing[6],
  },
  mx8: {
    marginHorizontal: spacing[7],
  },
  mx9: {
    marginHorizontal: spacing[8],
  },
  my1: {
    marginVertical: spacing[0],
  },
  my2: {
    marginVertical: spacing[1],
  },
  my3: {
    marginVertical: spacing[2],
  },
  my4: {
    marginVertical: spacing[3],
  },
  my5: {
    marginVertical: spacing[4],
  },
  my6: {
    marginVertical: spacing[5],
  },
  my7: {
    marginVertical: spacing[6],
  },
  my8: {
    marginVertical: spacing[7],
  },
  my9: {
    marginVertical: spacing[8],
  },
  p0: {
    padding: 0,
  },
  p1: {
    padding: spacing[0],
  },
  p2: {
    padding: spacing[1],
  },
  p3: {
    padding: spacing[2],
  },
  p4: {
    padding: spacing[3],
  },
  p5: {
    padding: spacing[4],
  },
  p6: {
    padding: spacing[5],
  },
  p7: {
    padding: spacing[6],
  },
  p8: {
    padding: spacing[7],
  },
  p9: {
    padding: spacing[8],
  },
  pb1: {
    paddingBottom: spacing[0],
  },
  pb2: {
    paddingBottom: spacing[1],
  },
  pb3: {
    paddingBottom: spacing[2],
  },
  pb4: {
    paddingBottom: spacing[3],
  },
  pb5: {
    paddingBottom: spacing[4],
  },
  pb6: {
    paddingBottom: spacing[5],
  },
  pb7: {
    paddingBottom: spacing[6],
  },
  pb8: {
    paddingBottom: spacing[7],
  },
  pb9: {
    paddingBottom: spacing[8],
  },
  pl1: {
    paddingLeft: spacing[0],
  },
  pl2: {
    paddingLeft: spacing[1],
  },
  pl3: {
    paddingLeft: spacing[2],
  },
  pl4: {
    paddingLeft: spacing[3],
  },
  pl5: {
    paddingLeft: spacing[4],
  },
  pl6: {
    paddingLeft: spacing[5],
  },
  pl7: {
    paddingLeft: spacing[6],
  },
  pl8: {
    paddingLeft: spacing[7],
  },
  pl9: {
    paddingLeft: spacing[8],
  },
  pr1: {
    paddingRight: spacing[0],
  },
  pr2: {
    paddingRight: spacing[1],
  },
  pr3: {
    paddingRight: spacing[2],
  },
  pr4: {
    paddingRight: spacing[3],
  },
  pr5: {
    paddingRight: spacing[4],
  },
  pr6: {
    paddingRight: spacing[5],
  },
  pr7: {
    paddingRight: spacing[6],
  },
  pr8: {
    paddingRight: spacing[7],
  },
  pr9: {
    paddingRight: spacing[8],
  },
  pt1: {
    paddingTop: spacing[0],
  },
  pt2: {
    paddingTop: spacing[1],
  },
  pt3: {
    paddingTop: spacing[2],
  },
  pt4: {
    paddingTop: spacing[3],
  },
  pt5: {
    paddingTop: spacing[4],
  },
  pt6: {
    paddingTop: spacing[5],
  },
  pt7: {
    paddingTop: spacing[6],
  },
  pt8: {
    paddingTop: spacing[7],
  },
  pt9: {
    paddingTop: spacing[8],
  },
  px1: {
    paddingHorizontal: spacing[0],
  },
  px2: {
    paddingHorizontal: spacing[1],
  },
  px3: {
    paddingHorizontal: spacing[2],
  },
  px4: {
    paddingHorizontal: spacing[3],
  },
  px5: {
    paddingHorizontal: spacing[4],
  },
  px6: {
    paddingHorizontal: spacing[5],
  },
  px7: {
    paddingHorizontal: spacing[6],
  },
  px8: {
    paddingHorizontal: spacing[7],
  },
  px9: {
    paddingHorizontal: spacing[8],
  },
  py1: {
    paddingVertical: spacing[0],
  },
  py2: {
    paddingVertical: spacing[1],
  },
  py3: {
    paddingVertical: spacing[2],
  },
  py4: {
    paddingVertical: spacing[3],
  },
  py5: {
    paddingVertical: spacing[4],
  },
  py6: {
    paddingVertical: spacing[5],
  },
  py7: {
    paddingVertical: spacing[6],
  },
  py8: {
    paddingVertical: spacing[7],
  },
  py9: {
    paddingVertical: spacing[8],
  },
})
