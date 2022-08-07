import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Dot } from "./dot"

storiesOf("Dot", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behaviour", () => (
    <Story>
      <UseCase text="Normal" usage="Normal style">
        <Dot />
      </UseCase>
      <UseCase text="Active" usage="When dot is active state">
        <Dot active />
      </UseCase>
    </Story>
  ))
