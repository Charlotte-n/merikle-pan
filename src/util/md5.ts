//@ts-ignore
import CryptoJS from 'crypto-js'

//加密
const md5 = (message: string, text: string) => {
  return CryptoJS.AES.encrypt(message, text).toString()
}

//解密
const digetMd5 = (message: string, text: string) => {
  const res = CryptoJS.AES.decrypt(message, text).toString(CryptoJS.enc.Utf8)
  return res.toString()
}

export { md5, digetMd5 }
