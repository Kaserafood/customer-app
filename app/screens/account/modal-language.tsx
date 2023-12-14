import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { Checkbox, Modal, Text } from "../../components"
import { utilSpacing } from "../../theme/Util"
import { ModalStateHandler } from "../../utils/modalState"
import { setLocaleI18n } from "../../i18n"
import { setLocale } from "../../services/api"

interface Props {
  modalState: ModalStateHandler
}

const ModalLanguage = ({ modalState }: Props) => {
  const [selectedLanguage, setSelectedLanguage] = useState("")

  useEffect(() => {
    setLocaleI18n(selectedLanguage)
    setLocale(selectedLanguage)
  }, [selectedLanguage])

  return (
    <Modal state={modalState}>
      <View>
        <Text tx="accountScreen.selectLanguage" preset="bold" size="lg"></Text>
        <Checkbox
          preset="medium"
          tx="common.spanish"
          value={selectedLanguage === "es"}
          onToggle={() => setSelectedLanguage("es")}
          style={utilSpacing.my4}
        ></Checkbox>

        <Checkbox
          preset="medium"
          tx="common.english"
          value={selectedLanguage === "en"}
          onToggle={() => setSelectedLanguage("en")}
          style={utilSpacing.mb4}
        ></Checkbox>
      </View>
    </Modal>
  )
}

export default ModalLanguage
