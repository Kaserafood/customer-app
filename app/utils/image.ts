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

export default checkIfImageExists
