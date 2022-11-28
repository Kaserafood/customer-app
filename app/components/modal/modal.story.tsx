import * as React from "react"
import { View } from "react-native"
import { storiesOf } from "@storybook/react-native"

import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { Button } from "../button/button"
import { Text } from "../text/text"

import { Modal } from "./modal"

const modalState = new ModalStateHandler()
const modalState1 = new ModalStateHandler()
const modalState2 = new ModalStateHandler()

storiesOf("Modal", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <Button text="Modal simple" onPress={() => modalState.setVisible(true)}></Button>
        <Button
          style={utilSpacing.mt4}
          text="Hide button close"
          onPress={() => modalState1.setVisible(true)}
        ></Button>
        <Button
          style={utilSpacing.mt4}
          text="Bottom modal"
          onPress={() => modalState2.setVisible(true)}
        ></Button>
        <Modal modal={modalState}>
          <View>
            <Text text="Body modal"></Text>
          </View>
        </Modal>
        <Modal modal={modalState1} isVisibleIconClose={false}>
          <View>
            <Text text="Body modal"></Text>
          </View>
        </Modal>
        <Modal modal={modalState2} position="bottom" isVisibleIconClose={false}>
          <View>
            <Text text="Body modal"></Text>
          </View>
        </Modal>
      </UseCase>
    </Story>
  ))
