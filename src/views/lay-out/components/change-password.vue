<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { Rule } from 'ant-design-vue/lib/form'
import { ResetPasswordApi } from '@/apis/lr.ts'
import { useStorage } from '@/hooks/useStorage.ts'
import { message } from 'ant-design-vue'
const storage = useStorage()
const UserInfo = JSON.parse(storage.getItem('userInfoExtra'))
const props = defineProps<{
  open: boolean
  userId?: string
}>()
const emits = defineEmits(['cancel'])
const formRef = ref()
const cancel = () => {
  emits('cancel')
}
const formData = ref({
  password: '',
  confirmPassword: ''
})
const checkConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(new Error('请再次输入密码'))
  } else if (value !== formData.value.password) {
    return Promise.reject(new Error('两次密码不一致'))
  } else {
    return Promise.resolve()
  }
}
const checkPassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject(new Error('请再次输入密码'))
  } else {
    return Promise.resolve()
  }
}
const rules: Record<string, Rule[]> = {
  password: [{ required: true, validator: checkPassword, trigger: 'change' }],
  confirmPassword: [{ required: true, validator: checkConfirmPassword, trigger: 'change' }]
}
//修改密码
const ResetPassword = async () => {
  const res = await ResetPasswordApi({
    //为了兼顾admin修改用户的密码
    email: props.userId ? props.userId : UserInfo.email,
    password: formData.value.password,
    twicePassword: formData.value.confirmPassword
  })
  if (res.code === 0) {
    message.success('修改成功')
    cancel()
  }
}
onBeforeUnmount(() => {
  if (!props.open && formRef.value) {
    formRef.value.resetField()
  }
})
</script>

<template>
  <Modal
    :open="props.open"
    title="修改密码"
    show-cancel
    :ok-btn="{
      text: '确定',
      type: 'primary'
    }"
    @close="cancel"
    @ok="ResetPassword"
    :btn-other-show="false"
  >
    <a-form
      @ref="formRef"
      class="pl-[20px] pr-[20px] pt-[20px] pb-[20px]"
      :model="formData"
      :rules="rules"
    >
      <a-form-item label="新密码" name="password">
        <a-input-password size="large" v-model:value="formData.password"></a-input-password>
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password size="large" v-model:value="formData.confirmPassword"></a-input-password>
      </a-form-item>
    </a-form>
  </Modal>
</template>

<style scoped lang="scss">
:deep(.ant-form-item-label) {
  width: 69.04px !important;
}
</style>
