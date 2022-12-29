import * as React from "react"
import { Alert, View } from "react-native"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { color } from "../../theme"

import { Header } from "./header"

declare let module

const VIEWSTYLE = {
  flex: 1,
  backgroundColor: color.storybookDarkBg,
}

storiesOf("Header", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <View style={VIEWSTYLE}>
          <Header headerText="Title page" />
        </View>
      </UseCase>
      <UseCase noPad text="leftIcon" usage="A left nav icon">
        <View style={VIEWSTYLE}>
          <Header
            headerText="Title page icon"
            leftIcon="back"
            onLeftPress={() => Alert.alert("left nav")}
          />
        </View>
      </UseCase>
    </Story>
  ))
