import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ripple from "react-native-material-ripple"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"

import { Button, Card, Header, Icon, Modal, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import { goBack } from "../../navigators/navigation-utilities"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { clear } from "../../utils/storage"

const modalState = new ModalStateHandler()
export const AccountScreen: FC<StackScreenProps<NavigatorParamList, "account">> = observer(
  function AccountScreen({ navigation }) {
    const { commonStore, userStore, addressStore, cartStore, messagesStore } = useStores()

    const closeSession = async () => {
      await clear()
      userStore.setUserId(undefined)
      userStore.setDisplayName(undefined)
      userStore.setAddressId(undefined)
      userStore.setEmail(undefined)
      addressStore.setCurrent(undefined)
      addressStore.setAddresses([])
      cartStore.cleanItems()
      commonStore.setIsSignedIn(false)
      navigation.navigate("init")
    }

    const removeAccount = () => {
      commonStore.setVisibleLoading(true)
      userStore
        .removeAccount(userStore.userId)
        .then(async (response) => {
          if (response) {
            messagesStore.showError("accountScreen.removeAccountSuccess", true)
            await closeSession()
          } else messagesStore.showError("accountScreen.removeAccountError", true)
        })
        .catch((error: Error) => {
          messagesStore.showError(error.message)
        })
        .finally(() => commonStore.setVisibleLoading(false))
    }

    return (
      <Screen preset="fixed">
        <Header headerTx="accountScreen.title" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          <View style={[styles.container, utilSpacing.mt4]}>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={utilSpacing.m3}
              onPressIn={closeSession}
            >
              <Card style={[utilSpacing.px4, utilSpacing.py5]}>
                <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                  <Icon
                    name="arrow-right-from-bracket"
                    style={utilSpacing.mr4}
                    size={30}
                    color={color.palette.grayDark}
                  />
                  <Text tx="accountScreen.logout" preset="semiBold" size="md"></Text>
                </View>
              </Card>
            </Ripple>
            <Ripple
              rippleOpacity={0.2}
              rippleDuration={400}
              style={utilSpacing.m3}
              onPressIn={() => modalState.setVisible(true)}
            >
              <Card style={[utilSpacing.px4, utilSpacing.py5]}>
                <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
                  <Icon
                    name="user-slash"
                    style={utilSpacing.mr4}
                    size={30}
                    color={color.palette.grayDark}
                  />
                  <Text tx="accountScreen.removeAccount" preset="semiBold" size="md"></Text>
                </View>
              </Card>
            </Ripple>
          </View>
        </ScrollView>

        <Modal modal={modalState} style={styles.modal}>
          <View style={utilSpacing.p4}>
            <Text
              preset="bold"
              size="lg"
              style={[utilSpacing.mb5, utilFlex.selfCenter]}
              tx="accountScreen.removeAccount"
            ></Text>
            <Text
              preset="semiBold"
              style={[utilSpacing.mb2, styles.textCenter]}
              tx="accountScreen.removeAccountConfirmation"
            ></Text>
            <Text
              style={[utilSpacing.mb5, styles.textCenter]}
              tx="accountScreen.removeAccountConfirmationInfo"
            ></Text>
            <Button
              tx="accountScreen.removeAccountConfirmationYes"
              style={[utilSpacing.mb5, utilFlex.selfCenter]}
              onPress={() => removeAccount()}
              block
            ></Button>
            <Button
              block
              preset="white"
              style={[utilSpacing.mb3, utilFlex.selfCenter]}
              tx="accountScreen.removeAccountConfirmationNo"
              onPress={() => modalState.setVisible(false)}
            ></Button>
          </View>
        </Modal>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flex: 1,
    minWidth: 300,
    width: "90%",
  },
  modal: {
    alignSelf: "center",
    minWidth: 300,
    width: "85%",
  },
  textCenter: {
    textAlign: "center",
  },
})
