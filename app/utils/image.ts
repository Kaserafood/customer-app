import images from "../assets/images"

const checkIfImageExists = async (url: string) => {
  const img = new Image()
  img.src = url

  if (img.complete) {
    return true
  } else {
    return new Promise((resolve) => {
      img.onload = () => {
        resolve(true)
      }

      img.onerror = () => {
        resolve(false)
      }
    })
  }
}
export type paymentType = "card" | "cash"
export type typeCard = "visa" | "mastercard" | "amex"

export const getImageByType = (type: paymentType, subType: typeCard | null) => {
  switch (type) {
    case "card":
      return getImageByTypeCard(subType)
    case "cash":
      return images.cash
    default:
      return images.cash
  }
}

export const getImageByTypeCard = (type: typeCard) => {
  switch (type) {
    case "visa":
      return images.cardVisa
    case "mastercard":
      return images.cardMastercard
    case "amex":
      return images.cardAmex
    default:
      return images.cardVisa
  }
}

export default checkIfImageExists
