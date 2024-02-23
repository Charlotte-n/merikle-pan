export interface CommonResponseType<T> {
  data: T
  code: number
  message: string
  status: number
}
