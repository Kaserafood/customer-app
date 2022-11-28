import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"

import { Loader } from "./loader"

storiesOf("Loader", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase text="Loader default" usage="On ajax request">
        <Loader visible></Loader>
      </UseCase>
    </Story>
  ))
