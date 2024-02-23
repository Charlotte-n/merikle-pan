import hyRequest from '@/services'
import type { CommonResponseType } from '@/apis/types/Response.ts'
import type {
  LoginDataType,
  LoginParam,
  RegisterParam,
  ResetPasswordParam
} from '@/apis/types/lr.ts'

enum BASEURL {
  IMAGE_CAPTCHA = '/lr/captcha',
  LOGIN = '/lr/login',
  VERIFY_CAPTCHA = '/lr/verifyCaptcha',
  EMAIL_SEND = '/lr/register-code',
  RESET_PASSWORD = '/lr/reset-password',
  VERIFY_CODE = '/lr/verifyCode',
  REGISTER = '/lr/register'
}

export const getImageCaptcha = async () => {
  return hyRequest.get({
    url: BASEURL.IMAGE_CAPTCHA
  })
}

export const LoginApi = (data: LoginParam) => {
  return hyRequest.post<CommonResponseType<LoginDataType>>({
    url: BASEURL.LOGIN,
    data
  })
}

export const VerifyCaptchaApi = (captcha: string) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.VERIFY_CAPTCHA,
    data: {
      captcha
    }
  })
}
/**
 * 邮箱发送验证码
 * @param address
 * @constructor
 */
export const SendEmailApi = (address: string) => {
  return hyRequest.get({
    url: BASEURL.EMAIL_SEND,
    params: {
      address
    }
  })
}

/**
 * 重置密码
 * @param data
 * @constructor
 */
export const ResetPasswordApi = (data: ResetPasswordParam) => {
  return hyRequest.patch<CommonResponseType<any>>({
    url: BASEURL.RESET_PASSWORD,
    data
  })
}

/**
 * 校验验证码
 * @param data
 */
export const verifyCodeApi = (data: { code: string; email: string }) => {
  return hyRequest.post<CommonResponseType<any>>({
    url: BASEURL.VERIFY_CODE,
    data: data
  })
}
/**
 * 注册
 * @param data
 */
export const registerApi = (data: RegisterParam) => {
  return hyRequest.post({
    url: BASEURL.REGISTER,
    data
  })
}
