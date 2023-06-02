import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import Ripple from "react-native-material-ripple"
import { Modal, Text, Image, Separator } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { saveString } from "../../utils/storage"
import { setCountryId } from "../../services/api"

interface ModalCountryProps {
  modalState: ModalStateHandler
}

export const ModalCountry = observer(({ modalState }: ModalCountryProps) => {
  const { countryStore, userStore } = useStores()

  useEffect(() => {
    modalState.setVisible(true)
    countryStore.getAll()
  }, [])

  useEffect(() => {
    if (countryStore.selectedCountry) {
      const countryId = countryStore.selectedCountry.id

      saveString("countryId", `${countryId}`)
      setCountryId(countryId)
    }
  }, [countryStore.selectedCountry])

  const handleSelectCountry = (country) => {
    userStore.setCountryId(country.id)
    countryStore.setSelectedCountry(country)
    modalState.setVisible(false)
  }

  return (
    <Modal modal={modalState} position="bottom" backdropColor="rgba(0,0,0,.75)">
      <View style={utilSpacing.mb5}>
        <Text preset="bold" size="lg" style={utilSpacing.mb5} tx="initScreen.selectCountry" />

        {countryStore.countries.map((item, index) => (
          <View key={item.id}>
            <Ripple onPress={() => handleSelectCountry(item)}>
              <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.py4]}>
                <Image style={[styles.flag, utilSpacing.mr4]} source={{ uri: item.flag }}></Image>
                <Text text={item.name} preset="semiBold" size="md" style={utilSpacing.pb1}></Text>
              </View>
            </Ripple>
            {index !== countryStore.countries.length - 1 && <Separator></Separator>}
          </View>
        ))}
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  flag: {
    borderColor: color.palette.whiteGray,
    borderRadius: 50,
    borderWidth: 1,
    height: 50,
    width: 50,
  },
})
