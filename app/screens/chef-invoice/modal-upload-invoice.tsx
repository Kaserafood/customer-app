import React, { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import DocumentPicker from "react-native-document-picker"
import images from "../../assets/images"
import { Button, Image, Modal, Text } from "../../components"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { Api } from "../../services/api"
import { utilFlex, utilSpacing } from "../../theme/Util"
import { ModalState } from "../../utils/modalState"

interface Props {
  modalState: ModalState
  orderId: number
  code?: string
  onUploaded: () => void
}

const ModalUploadInvoice = ({ modalState, onUploaded, orderId, code }: Props) => {
  const { commonStore, messagesStore } = useStores()

  const [selectedFile, setSelectedFile] = useState({
    type: "",
    uri: "",
    name: "",
  })

  useEffect(() => {
    if (orderId)
      setSelectedFile({
        type: "",
        uri: "",
        name: "",
      })
  }, [orderId])

  const handlePickDocument = async () => {
    try {
      const result: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      })

      if (Array.isArray(result)) {
        const file = result[0]

        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
          setSelectedFile({
            type: file.type,
            uri: file.uri,
            name: file.name,
          })
        } else {
          Alert.alert("Error", translate("chefInvoiceScreen.invalidSelectedFile"))
        }
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert("Error", translate("chefInvoiceScreen.errorToSelectFile"))
      }
    }
  }

  const handleUpload = () => {
    const formData: any = new FormData()
    formData.append("invoice", selectedFile)
    formData.append("orderId", orderId.toString())
    formData.append("code", code)

    const api = new Api()

    commonStore.setVisibleLoading(true)
    api
      .uploadInvoice(formData)
      .then((res) => {
        if (res.kind === "ok" && res.data.value) {
          messagesStore.showSuccess("chefInvoiceScreen.uploadSuccess", true)
          onUploaded()
          modalState.setVisible(false)
          console.log("res", res.data)
        } else messagesStore.showError("chefInvoiceScreen.uploadError", true)
      })
      .catch(() => {
        messagesStore.showError("chefInvoiceScreen.uploadError", true)
        commonStore.setVisibleLoading(false)
      })
  }

  return (
    <Modal state={modalState} position="bottom">
      <View>
        <Text
          preset="bold"
          size="lg"
          text={translate("chefInvoiceScreen.uploadInvoiceOrder", { order: code || orderId })}
        ></Text>

        {selectedFile.type ? (
          <>
            {selectedFile.type === "application/pdf" ? (
              <Image
                source={images.pdf}
                style={[styles.image, utilFlex.selfCenter, utilSpacing.my4]}
              />
            ) : (
              <Image
                source={{ uri: selectedFile.uri }}
                style={[styles.image, utilFlex.selfCenter, utilSpacing.my4]}
              />
            )}

            <Text text={selectedFile.name} style={[utilSpacing.p4, utilFlex.selfCenter]}></Text>
          </>
        ) : (
          <View style={styles.empty}></View>
        )}

        {!!selectedFile.type && (
          <Button
            tx="chefInvoiceScreen.uploadFile"
            style={[utilSpacing.py4, styles.btn, utilFlex.selfCenter, utilSpacing.mb4]}
            onPress={handleUpload}
            size="sm"
          ></Button>
        )}
        <Button
          tx="chefInvoiceScreen.pickFile"
          style={[utilSpacing.py4, styles.btn, utilFlex.selfCenter]}
          onPress={handlePickDocument}
          preset={selectedFile.type ? "gray" : "primary"}
        ></Button>

        <Text
          caption
          tx="chefInvoiceScreen.selectImagOrPDF"
          style={[utilFlex.selfCenter, utilSpacing.py3]}
        ></Text>
      </View>
    </Modal>
  )
}

export default ModalUploadInvoice

const styles = StyleSheet.create({
  btn: {
    width: 215,
  },
  empty: {
    height: 60,
  },
  image: {
    height: 115,
    width: 115,
  },
})
