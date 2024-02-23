export interface ModalPropsType {
  width?: number
  title?: string
  btnOtherShow: boolean
  okBtn?: {
    text: string
    type: string
  }
  open: boolean
  showCancel?: boolean
  okExtraText?: string
}
