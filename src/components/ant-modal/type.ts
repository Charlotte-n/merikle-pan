export interface ModalPropsType {
  width?: number
  title?: string
  okBtn?: {
    text: string
    type: string
  }
  open: boolean
  showCancel?: boolean
}
