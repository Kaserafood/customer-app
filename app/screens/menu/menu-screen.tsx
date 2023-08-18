import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { ButtonFooter, Header, Screen, Text } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"
import { utilSpacing } from "../../theme/Util"
import Days from "./days"
import Lunches from "./lunches"

export const MenuScreen: FC<StackScreenProps<NavigatorParamList, "menu">> = observer(
  ({ navigation, route: { params } }) => {
    const [currentDate, setCurrentDate] = useState("")

    return (
      <Screen preset="fixed">
        <Header headerTx="menuScreen.title" leftIcon="back" onLeftPress={goBack} />
        <ScrollView>
          <View style={[utilSpacing.p5, utilSpacing.mb3]}>
            <Text
              tx="menuScreen.scheduleThisWeek"
              preset="bold"
              size="lg"
              style={utilSpacing.mb4}
            ></Text>

            <Days
              onDateChange={(date: string) => {
                setCurrentDate(date)
              }}
            ></Days>
          </View>

          <Lunches></Lunches>
        </ScrollView>
        <ButtonFooter
          text="Usar créditos (10)"
          onPress={() => navigation.push("menuSummary")}
        ></ButtonFooter>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({})

export default MenuScreen
