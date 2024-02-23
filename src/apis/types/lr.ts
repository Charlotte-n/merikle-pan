export type LoginDataType = {
  _id: string
  email: string
  qq_open_id: number
  nick_name: string
  create_time: string
}

export type LoginParam = {
  email: string
  password: string
  is_remember: number
}

export type ResetPasswordParam = {
  email: string
  password: string
  twicePassword: string
}

export type RegisterParam = {
  email: string
  nick_name: string
  password: string
  twicePassword: string
}
