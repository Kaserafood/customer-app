import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { StyleSheet } from "react-native"
import DocumentPicker from "react-native-document-picker"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Header, Image, Screen } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"

export const ChefInvoiceScreen: FC<StackScreenProps<NavigatorParamList, "chefInvoice">> = observer(
  function ChefInvoiceScreen({ navigation }) {
    const [imageSelected, setImageSelected] = useState(null)

    const handlePickDocument = async () => {
      try {
        const result: any = await DocumentPicker.pick({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        })
        // console.log(result)

        const file = result[0]

        console.log(file)

        // Handle the selected file based on its type
        if (file.type === "application/pdf") {
          console.log("PDF selected", `File name: ${file.name}`)
        } else if (file.type.startsWith("image/")) {
          setImageSelected(file.uri)
          console.log("Image selected", `File name: ${file.uri}`)
        } else {
          console.log("Unsupported file type", `File name: ${file.name}`)
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the document picker
          console.log("Document picker cancelled")
        } else {
          // An error occurred during document picking
          console.log("Error picking document", err)
        }
      }
    }
    return (
      <Screen preset="fixed">
        <Header headerText="Subir factura" leftIcon="back" onLeftPress={goBack}></Header>
        <ScrollView>
          {imageSelected && (
            <Image source={{ uri: imageSelected }} style={{ width: 200, height: 200 }} />
          )}

          <Button text="Pick Document" onPress={handlePickDocument} />
        </ScrollView>
      </Screen>
    )
  },
)

const styles = StyleSheet.create({})
