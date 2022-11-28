import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"

import { Separator } from "./separator"

storiesOf("Separator", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Default" usage="default style">
        <Separator />
      </UseCase>
      <UseCase text="Custom style" usage="custom style">
        <Separator />
      </UseCase>
    </Story>
  ))
