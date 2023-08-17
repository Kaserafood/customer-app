import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { StyleSheet, View } from "react-native"
import * as Animatable from "react-native-animatable"
import ProgressBar from "react-native-animated-progress"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Button, ButtonFooter, Icon, Screen, Text } from "../../components"
import { NavigatorParamList, goBack } from "../../navigators"
import { color, spacing } from "../../theme"
import { utilFlex, utilSpacing, utilText } from "../../theme/Util"
import ItemAnswer from "./item-answer"

export const FormPlans: FC<StackScreenProps<NavigatorParamList, "formPlans">> = observer(
  function FormPlans({ navigation }) {
    const [selectedProtein, setSelectedProtein] = useState([])
    const [selectedTypeFood, setSelectedTypeFood] = useState([])
    const [selectedAllergies, setSelectedAllergies] = useState([])
    const [currentStep, setCurrentStep] = useState(1)

    const proteins = [
      {
        label: "Pollo",
        value: "pollo",
      },
      {
        label: "Pescado",
        value: "pescado",
      },

      {
        label: "Res",
        value: "res",
      },
      {
        label: "Cerdo",
        value: "cerdo",
      },
      {
        label: "Proteina vegetal",
        value: "proteina-vegetal",
      },
      {
        label: "Pato",
        value: "pato",
      },
    ]

    const typeFood = [
      {
        label: "Sin gluten",
        value: "sin-gluten",
      },
      {
        label: "Sin lactosa",
        value: "sin-lactosa",
      },
      {
        label: "Keto",
        value: "keto",
      },
      {
        label: "Sin azucar",
        value: "sin-azucar",
      },
      {
        label: "Bajo en grasa",
        value: "bajo-en-grasa",
      },
      {
        label: "Vegano",
        value: "vegano",
      },
    ]

    const allergies = [
      {
        label: "Nueces",
        value: "nueces",
      },
      {
        label: "Mani",
        value: "mani",
      },
      {
        label: "Lactosa",
        value: "lactosa",
      },
      {
        label: "Trigo",
        value: "trigo",
      },
      {
        label: "Gluten",
        value: "gluten",
      },
      {
        label: "Huevo",
        value: "huevo",
      },
      {
        label: "Soya",
        value: "soya",
      },
    ]

    const handleSelectAnswer = (selectedItem, currentValues, setValues) => {
      if (currentValues.map((item) => item.value).includes(selectedItem.value)) {
        setValues(currentValues.filter((p) => p.value !== selectedItem.value))
      } else {
        setValues([...currentValues, selectedItem])
      }
    }

    const handleContinue = () => {
      if (currentStep === 1) {
        setCurrentStep(2)
      } else {
        // navigation.navigate("formPlansTwo")
      }
    }

    return (
      <Screen
        preset="fixed"
        statusBarBackgroundColor={color.palette.grayPlaceHolder}
        statusBar="dark-content"
      >
        <ScrollView style={utilSpacing.p5}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="xmark" size={30} color={color.text}></Icon>
          </TouchableOpacity>

          <Text
            tx="formPlansScreen.knowYou"
            preset="bold"
            size="xl"
            style={[utilSpacing.mt3, utilSpacing.mb6]}
          ></Text>

          <View style={[utilFlex.flexRow, utilFlex.flexCenterVertical]}>
            <View style={utilFlex.flex1}>
              <ProgressBar
                progress={currentStep === 1 ? 50 : 100}
                height={7}
                backgroundColor={color.primary}
                trackColor={color.palette.grayLight}
                progressDuration={450}
              />
            </View>

            <Text text={`${currentStep === 1 ? 50 : 100}%`} style={utilSpacing.ml4}></Text>
          </View>

          {currentStep === 1 ? (
            <View style={[styles.containerTitleQuestion, utilSpacing.p6, utilSpacing.mt5]}>
              <Text
                text={`${currentStep} / 2`}
                preset="bold"
                size="lg"
                style={[utilFlex.selfCenter, utilText.textPrimary]}
              ></Text>

              <Text
                tx={"formPlansScreen.protein"}
                preset="semiBold"
                size="lg"
                style={utilFlex.selfCenter}
              ></Text>
            </View>
          ) : (
            <Animatable.View animation="fadeIn">
              <View style={[styles.containerTitleQuestion, utilSpacing.p6, utilSpacing.mt5]}>
                <Text
                  text={`${currentStep} / 2`}
                  preset="bold"
                  size="lg"
                  style={[utilFlex.selfCenter, utilText.textPrimary]}
                ></Text>

                <Text
                  tx={"formPlansScreen.markOptionsIdentifyYou"}
                  preset="semiBold"
                  size="lg"
                  style={utilFlex.selfCenter}
                ></Text>
              </View>
            </Animatable.View>
          )}

          {currentStep === 1 ? (
            <View style={[utilFlex.flexRow, utilFlex.flexWrap, utilSpacing.mt5]}>
              {proteins.map((protein, index) => (
                <ItemAnswer
                  key={protein.value}
                  {...protein}
                  onPress={() => handleSelectAnswer(protein, selectedProtein, setSelectedProtein)}
                  isSelected={selectedProtein.map((item) => item.value).includes(protein.value)}
                ></ItemAnswer>
              ))}
            </View>
          ) : (
            <Animatable.View animation="fadeIn">
              <View style={[utilFlex.flexRow, utilFlex.flexWrap, utilSpacing.mt5]}>
                {typeFood.map((typeFood, index) => (
                  <ItemAnswer
                    key={typeFood.value}
                    {...typeFood}
                    onPress={() =>
                      handleSelectAnswer(typeFood, selectedTypeFood, setSelectedTypeFood)
                    }
                    isSelected={selectedTypeFood.map((item) => item.value).includes(typeFood.value)}
                  ></ItemAnswer>
                ))}
              </View>

              <View style={[styles.containerTitleQuestion, utilSpacing.p6, utilSpacing.mt7]}>
                <Text
                  tx="formPlansScreen.allergy"
                  preset="semiBold"
                  size="lg"
                  style={utilFlex.selfCenter}
                ></Text>
              </View>

              <View style={[utilFlex.flexRow, utilFlex.flexWrap, utilSpacing.mt5]}>
                {allergies.map((allergy, index) => (
                  <ItemAnswer
                    key={allergy.value}
                    {...allergy}
                    onPress={() =>
                      handleSelectAnswer(allergy, selectedAllergies, setSelectedAllergies)
                    }
                    isSelected={selectedAllergies.map((item) => item.value).includes(allergy.value)}
                  ></ItemAnswer>
                ))}
              </View>
            </Animatable.View>
          )}
        </ScrollView>

        {selectedProtein.length > 0 && (
          <Animatable.View animation="fadeIn">
            <ButtonFooter onPress={handleContinue} tx="common.continue"></ButtonFooter>
            {currentStep === 2 && (
              <Button
                style={utilSpacing.py3}
                preset="white"
                block
                tx="formPlansScreen.hop"
              ></Button>
            )}
          </Animatable.View>
        )}
      </Screen>
    )
  },
)

const styles = StyleSheet.create({
  containerTitleQuestion: {
    backgroundColor: color.palette.whiteGray,
    borderRadius: spacing[2],
  },
})
