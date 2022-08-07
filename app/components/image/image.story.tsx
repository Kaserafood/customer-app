/* eslint-disable */
import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import images from "../../assets/images"
import { Image } from "./image"

declare let module

const rick = images.hamburger
const morty = { uri: "https://rickandmortyapi.com/api/character/avatar/2.jpeg" }

storiesOf("Image", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="With require()">
        <Image source={rick} style={{ width: 150 }} />
        <Image source={rick} style={{ width: 150, height: 150 }} />
        <Image source={rick} style={{ height: 150 }} />
        <Image source={rick} style={{ height: 150, resizeMode: "contain" }} />
      </UseCase>
      <UseCase text="With URL">
        <Image source={morty} style={{ width: 150 }} />
        <Image source={morty} style={{ width: 150, height: 150 }} />
        <Image source={morty} style={{ height: 150 }} />
        <Image source={morty} style={{ height: 150, resizeMode: "contain" }} />
      </UseCase>
    </Story>
  ))
