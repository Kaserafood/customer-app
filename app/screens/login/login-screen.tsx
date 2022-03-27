import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  SafeAreaView,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  StatusBar,
  BackHandler,
  Alert,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import {
  Button,
  Checkbox,
  DishDetail,
  GradientBackground,
  Header,
  Screen,
  Text,
  TextField,
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { goBack } from "../../navigators/navigation-utilities"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
  width: 343,
  height: 230,
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.deepPurple,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const AREA_VIEW: ViewStyle = {
  backgroundColor: color.palette.deepPurple,

  flex: 1,
}

interface Data {
  title: string
  description: string
  images: Array<string>
  tags: Array<string>
}

export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    const nextScreen = () => navigation.navigate("demo")
    const goBack = () => navigation.goBack()

    const [terms, setTerms] = useState(false)

    const data: Data = {
      title: "Platillo 1 de pruebas",
      description: "Este es un nuevo platill de purebas",
      images: [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      ],

      tags: ["Nuevo", "Delicioso", "Calientito"],
    }

    return (
      <SafeAreaView style={AREA_VIEW}>
        <StatusBar backgroundColor={color.palette.orange}></StatusBar>
        <Screen style={ROOT} preset="scroll">
          <View style={FULL}>
            <GradientBackground colors={["#422443", "#281b34"]} />
            <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
              <Header
                headerTx="loginScreen.title"
                onLeftPress={goBack}
                style={HEADER}
                leftIcon="back"
                titleStyle={HEADER_TITLE}
              />
              <DishDetail data={data}></DishDetail>
              <Checkbox onToggle={() => setTerms(!terms)} value={terms}></Checkbox>
              <Button preset="secondary" text="hola"></Button>
            </Screen>
            <SafeAreaView style={FOOTER}>
              <View style={FOOTER_CONTENT}>
                <Button
                  testID="next-screen-button"
                  style={CONTINUE}
                  textStyle={CONTINUE_TEXT}
                  tx="welcomeScreen.continue"
                  onPress={nextScreen}
                />
              </View>
            </SafeAreaView>
          </View>
        </Screen>
      </SafeAreaView>
    )
  },
)
