import forge from "node-forge"

const getPublicKey = () => {
  return `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQ7zkizXaVHusN3UytFqyEXGXD
  nyPO2ggSkuHEZEOXuBhpxVRgLEcnFWVL3AN5RUNDqe8R4ZRrmFUH2uOlutorw9RM
  FmJDM3qkBietfnAp68sUgQFQ7/sAvL8hR12QWV9l8YFKVRf9gKWBH+/FQCvbD056
  HDw6aoJpj4e+9+9WBwIDAQAB
  -----END PUBLIC KEY-----
  `
}

export function encrypt(toEncrypt: string): string {
  const publicKeyObj = forge.pki.publicKeyFromPem(getPublicKey())
  const encrypted = publicKeyObj.encrypt(toEncrypt, "RSA-OAEP")
  const plaintext = forge.util.encode64(encrypted)

  return plaintext
}

// export function encrypt(toEncrypt: string): Promise<string> {
//   // RSA.generateKeys(4096) // set key size
//   //   .then((keys) => {
//   //     console.log("4096 private:", keys.private) // the private key
//   //     console.log("4096 public:", keys.public) // the public key
//   //     RSA.encrypt(toEncrypt, keys.public).then((encodedMessage) => {
//   //       console.log(`the encoded message is ${encodedMessage}`)
//   //       RSA.decrypt(encodedMessage, keys.private).then((decryptedMessage) => {
//   //         console.log(`The original message was ${decryptedMessage}`)
//   //       })
//   //     })
//   //   })

//   // Assuming you have a public key
//   const publicKeyObj = forge.pki.publicKeyFromPem(getPublicKey())
//   const encrypted = publicKeyObj.encrypt(toEncrypt, "RSA-OAEP")
//   return forge.util.encode64(encrypted)
// }

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
