import JSEncrypt from "jsencrypt"

const getPublicKey = () => {
  return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArj/bWv1t9x0V0GxCsygE
18THaPyS92u8qvxQ9X+aNDs/OGhxAgLYgS5cPDdbpY7ZULcxdGHn5ILm5bpUZrbg
Ls3PZgRoBfKBKCeBhv7sn8hwG/yNHvSbmRRcn5IBGqzgutkF9Wt9vLkRI+ZoX3ba
p1ProjiqTQmg4/VRptcS41nY4odlXyaVZ0imcWYvy94zlT89v8K/tPvB6Ri/LwXz
xOyiHEoaRCNTN52qeJiN+TqGjs591K3/kb62LRgTSYYtW2ThoPujsYj04748Z65g
u9afJuvfMq2tTVhwI5yrRgWnrpshBhx2z9AveW9KG53T3IeavfPGSOmIDsrq9Ub4
EwIDAQAB
-----END PUBLIC KEY-----
`
}

export function encrypt(toEncrypt: string): string {
  const crypt = new JSEncrypt()
  crypt.setKey(getPublicKey())
  return crypt.encrypt(toEncrypt) || ""
}
