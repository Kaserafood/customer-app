import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { Card } from "./card"

storiesOf("Card", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Card with child" usage="Card with any child component inside">
        <Card>
          <View style={{ height: 100, width: 100, backgroundColor: color.primary }}></View>
        </Card>
      </UseCase>
      <UseCase text="With style" usage="Custom style">
        <Card style={{ backgroundColor: color.storybookDarkBg }}>
          <View style={{ height: 100, width: 100, backgroundColor: color.primary }}></View>
        </Card>
      </UseCase>
    </Story>
  ))
