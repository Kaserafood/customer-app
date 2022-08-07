import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Icon } from "./icon"

declare let module

let iconNames = "house,angle-right,location-dot-1,check,check-1,circle-check-1,circle-1,angle-left-1,angle-left,user,hat-chef,magnifying-glass,bars-1,xmark,moped,cart-shopping,plus,minus,plug-circle-xmark,shield-check,pot-food,arrow-right-from-bracket,circle,circle-check,angle-down,caret-down,location-dot".split(
  ",",
)
storiesOf("Icon", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Names", () => (
    <Story>
      {iconNames.map((name) => (
        <UseCase text={name} usage={name}>
          <Icon name={name} color="#111" size={40} />
        </UseCase>
      ))}
    </Story>
  ))
