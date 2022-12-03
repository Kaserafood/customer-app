import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"

storiesOf("InputText", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        {/* TODO: Add stories for this component */}
      </UseCase>
    </Story>
  ))
