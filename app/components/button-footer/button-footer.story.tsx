/* eslint-disable react-native/no-inline-styles */
import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"

import { ButtonFooter } from "./button-footer"

storiesOf("ButtonFooter", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <ButtonFooter text="Click it" />
      </UseCase>
      <UseCase text="Style " usage="With custom stye">
        <ButtonFooter text="Click it" style={{ height: 150 }} />
      </UseCase>
    </Story>
  ))
