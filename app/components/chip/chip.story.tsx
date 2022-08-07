import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { utilSpacing } from "../../theme/Util"
import { Chip } from "./chip"

storiesOf("Chip", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <Chip text="Chip " />
      </UseCase>
      <UseCase text="Style" usage="With custom style">
        <Chip text="Chip " style={utilSpacing.p6} />
      </UseCase>
      <UseCase text="Active" usage="Active state">
        <Chip text="Chip " active />
      </UseCase>
    </Story>
  ))
