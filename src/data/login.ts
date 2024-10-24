import { ref } from 'vue'
import type { Rule } from 'ant-design-vue/lib/form'
import { VerifyCaptchaApi } from '@/apis/lr'

export enum login {
  'login' = 0,
  'register' = 1,
  'forgot' = 2
}

//公用的
const formState = ref({
  email: '',
  password: '',
  remember: '',
  verifyCode: '',
  username: '',
  twicePassword: '',
  code: '',
  is_remember: 0
})
export const CheckEmail = (_rule: Rule, email: string) => {
  // 邮箱验证正则
  if (email === '') {
    return Promise.reject('请输入邮箱')
  } else {
    const reg = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/
    if (!reg.test(email)) {
      return Promise.reject('邮箱格式不正确')
    }
    return Promise.resolve()
  }
}
export const CheckPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码')
  } else {
    return Promise.resolve()
  }
}
export const CheckUserName = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入昵称')
  } else {
    return Promise.resolve()
  }
}
export const CheckCode = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入验证码')
  } else {
    return Promise.resolve()
  }
}

export const CheckTwicePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码')
  } else {
    if (value !== formState.value.password) {
      return Promise.reject('两次输入的密码不匹配')
    } else {
      return Promise.resolve()
    }
  }
}
export const CheckVerifyCode = async (_rule: Rule, value: string) => {
  //进行校验
  const res = await VerifyCaptchaApi(value)
  if (value === '') {
    return Promise.reject('请输入验证码')
  } else if (res.code === 1) {
    return Promise.reject('验证码不正确')
  }
}

const rules: Record<string, Rule[]> = {
  email: [{ trigger: 'change', validator: CheckEmail }],
  password: [{ required: true, trigger: 'change', validator: CheckPass }],
  verifyCode: [{ required: true, trigger: 'blur', validator: CheckVerifyCode }],
  username: [{ required: true, trigger: 'change', validator: CheckUserName }],
  twicePassword: [{ required: true, trigger: 'change', validator: CheckTwicePass }],
  code: [{ required: true, trigger: 'change', validator: CheckCode }]
}
export { formState, rules }
