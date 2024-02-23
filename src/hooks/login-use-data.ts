import { formState, rules } from '@/data/login.ts'
import { computed } from 'vue'
import type { ModalPropsType } from '@/components/ant-modal/type.ts'

export const useLoginData = () => {
  return {
    formState,
    rules
  }
}

export const useModal = (props: ModalPropsType) => {
  const open = computed(() => props.open)
  const width = computed(() => props.width)
  const title = computed(() => props.title)
  const btn = computed(() => props.okBtn)
  const okExtraText = computed(() => props.okExtraText)
  const btnOtherShow = computed(() => props.btnOtherShow)
  return {
    open,
    width,
    title,
    btn,
    okExtraText,
    btnOtherShow
  }
}
