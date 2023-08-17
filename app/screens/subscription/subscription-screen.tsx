import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Icon, Screen, Text } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"
import { color } from "../../theme"
import { utilSpacing } from "../../theme/Util"
import Info from "./info"
import Options from "./options"
import TestDish from "./test-dish"

export const Subscription: FC<StackScreenProps<NavigatorParamList, "subscription">> = observer(
  function SubscriptionScreen() {
    return (
      <Screen
        preset="fixed"
        statusBarBackgroundColor={color.palette.white}
        statusBar="dark-content"
      >
        <ScrollView>
          <View style={utilSpacing.p5}>
            <TouchableOpacity onPress={goBack}>
              <Icon name="xmark" size={30} color={color.text}></Icon>
            </TouchableOpacity>

            <Text
              tx="subscriptionScreen.description"
              preset="bold"
              size="xl"
              style={[utilSpacing.mt3, utilSpacing.mb1]}
            ></Text>
          </View>

          <Options></Options>

          <TestDish></TestDish>
          <Info></Info>
        </ScrollView>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({})
