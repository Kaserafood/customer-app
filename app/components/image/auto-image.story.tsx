/* eslint-disable */
import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Image } from "./image"

declare let module

const rick = require("./rick.png")
const morty = { uri: "https://rickandmortyapi.com/api/character/avatar/2.jpeg" }

storiesOf("AutoImage", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="With require()">
        <Image source={rick} />
        <Image source={rick} style={{ width: 150 }} />
        <Image source={rick} style={{ width: 150, height: 150 }} />
        <Image source={rick} style={{ height: 150 }} />
        <Image source={rick} style={{ height: 150, resizeMode: "contain" }} />
      </UseCase>
      <UseCase text="With URL">
        <Image source={morty} />
        <Image source={morty} style={{ width: 150 }} />
        <Image source={morty} style={{ width: 150, height: 150 }} />
        <Image source={morty} style={{ height: 150 }} />
        <Image source={morty} style={{ height: 150, resizeMode: "contain" }} />
      </UseCase>
    </Story>
  ))
