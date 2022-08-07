import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Price } from "./price"

storiesOf("Price", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Simple" usage="Ony show the number">
        <Price amount={100} preset="simple" />
      </UseCase>
      <UseCase text="Dish" usage="Price for dishes">
        <Price amount={100} preset="dish" />
      </UseCase>
      <UseCase text="Delviery" usage="Price for delivery">
        <Price amount={100} preset="delivery" />
      </UseCase>
    </Story>
  ))
