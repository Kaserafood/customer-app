import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Ripple from "react-native-material-ripple"
import { Image, Modal, Separator, Text } from "../../components"
import { setLocaleI18n } from "../../i18n"
import { useStores } from "../../models"
import { setCountryId, setLocale } from "../../services/api"
import { color } from "../../theme"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { saveString } from "../../utils/storage"

interface ModalCountryProps {
  modalState: ModalStateHandler
}

export const ModalCountry = observer(({ modalState }: ModalCountryProps) => {
  const { countryStore, userStore } = useStores()

  useEffect(() => {
    // modalState.setVisible(true)
    countryStore.getAll()
  }, [])

  useEffect(() => {
    const country = countryStore.selectedCountry
    if (country) {
      userStore.setCountryId(country.id)
      userStore.setAddressId(undefined)

      setLocaleI18n(country.language)
      setLocale(country.language)

      saveString("countryId", `${country.id}`)
      saveString("locale", `${country.language}`)
      setCountryId(country.id)
    }
  }, [countryStore.selectedCountry?.id])

  const handleSelectCountry = (country) => {
    countryStore.setSelectedCountry(country)

    setTimeout(() => {
      modalState.setVisible(false)
    }, 500)
  }

  return (
    <Modal state={modalState} position="bottom" backdropColor="rgba(0,0,0,.75)">
      <View style={utilSpacing.mb5}>
        <Text
          preset="bold"
          size="lg"
          style={[utilSpacing.mb5, utilSpacing.px6]}
          tx="initScreen.selectCountry"
        />

        {countryStore.countries.map((item, index) => (
          <View key={item.id}>
            <Ripple style={utilSpacing.px6} onPress={() => handleSelectCountry(item)}>
              <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical, utilSpacing.py4]}>
                <Image style={[styles.flag, utilSpacing.mr4]} source={{ uri: item.flag }}></Image>
                <Text text={item.name} preset="semiBold" size="md" style={utilSpacing.pb1}></Text>
              </View>
            </Ripple>
            {index !== countryStore.countries.length - 1 && (
              <Separator style={utilSpacing.px6}></Separator>
            )}
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
