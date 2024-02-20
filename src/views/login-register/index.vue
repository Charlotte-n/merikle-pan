<script setup lang="ts">
import { ref } from 'vue'
import { useLoginData } from '@/hooks/login-use-data.ts'
import { UserOutlined, LockOutlined, VerifiedOutlined } from '@ant-design/icons-vue'
import AntModal from '@/components/ant-modal/ant-modal.vue'
import { login } from '@/data/login.ts'
import type { FormInstance } from 'ant-design-vue'
const show = ref(0) //登录为0，没有账号注册为1，忘记密码为2
const { formState, rules } = useLoginData()
const formRef = ref<FormInstance>()
let map = new Map()
const open = ref(false)
const disabled = ref(false)
const codeDisabled = ref(true)

const setShow = (val: number) => {
  show.value = val
}
const clearValid = () => {
  formRef.value?.clearValidate()
}
const resetForm = () => {
  formRef.value?.resetFields()
  formState.value = {
    code: '',
    email: '',
    password: '',
    remember: '',
    twicePassword: '',
    username: '',
    verifyCode: ''
  }
}
//处理按钮状态
const handleValidate = (name: any, statues: any) => {
  if (statues === true) {
    console.log(map.has('email'))
    map.set(name, statues)
    switch (show.value) {
      case login.login:
        if (map.size === 3) {
          disabled.value = true
        }
        break
      case login.register:
        if (map.size === 6) {
          disabled.value = true
        }
        codeDisabled.value = !map.has('email')

        break
      case login.forgot:
        if (map.size === 5) {
          disabled.value = true
        }
        codeDisabled.value = !map.has('email')
        break
    }
  } else {
    map.has(name) && map.delete(name)
    disabled.value = false
    codeDisabled.value = true
  }
}
//点击切换状态后的改变
const handleChange = (status: number) => {
  setShow(status)
  clearValid()
  resetForm()
  map.clear()
  disabled.value = false
  codeDisabled.value = true
}
//弹窗
const handleOpen = () => {
  open.value = true
}
const cancel = () => {
  open.value = false
}
const sendCode = () => {
  console.log('发送成功')
}
</script>

<template>
  <div class="bg">
    <div class="login-bg"></div>
    <a-card class="m-auto">
      <header class="text-[#6399CD] text-center mb-[20px] text-[20px]">Merikle云盘</header>
      <a-form ref="formRef" :model="formState" :rules="rules" @validate="handleValidate">
        <!--        输入邮箱-->
        <a-form-item name="email">
          <a-input
            v-model:value="formState.email"
            size="large"
            class="w-[400px]"
            placeholder="请输入邮箱"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <!--        注册获取验证码-->
        <a-form-item v-if="show === login.register || show === login.forgot" name="code">
          <div class="flex items-center">
            <a-input v-model:value="formState.code" size="large" placeholder="请输入验证码">
              <template #prefix>
                <VerifiedOutlined class="site-form-item-icon" />
              </template>
            </a-input>
            <a-button
              type="primary"
              class="ml-[10px] h-[38px]"
              :disabled="codeDisabled"
              @click="handleOpen"
              >获取验证码</a-button
            >
          </div>
        </a-form-item>

        <!--        请输入昵称-->
        <a-form-item v-if="show === login.register" name="username">
          <a-input v-model:value="formState.username" size="large" placeholder="请输入昵称">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <!--        输入密码-->
        <a-form-item name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <!--        再次输入密码-->
        <a-form-item v-if="show === login.register || show === login.forgot" name="twicePassword">
          <a-input-password
            v-model:value="formState.twicePassword"
            size="large"
            placeholder="请再次输入密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <!--        输入验证码-->
        <a-form-item name="verifyCode">
          <a-input v-model:value="formState.verifyCode" size="large" placeholder="请输入验证码">
            <template #prefix>
              <VerifiedOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <!--记住我-->
        <a-form-item name="remember" no-style v-if="show === login.login">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>
        <a-form-item class="mt-[10px] mb-[10px]">
          <span
            v-if="show === login.login"
            class="text-[#1677FF] cursor-pointer hover:opacity-20"
            @click="handleChange(login.forgot)"
            >忘记密码</span
          >
          <span
            v-if="show === login.login"
            class="login-account text-[#1677FF] cursor-pointer hover:opacity-20"
            @click="handleChange(login.register)"
            >没有账号</span
          >
          <span
            v-if="show === login.register"
            class="text-[#1677FF] cursor-pointer hover:opacity-20"
            @click="handleChange(login.login)"
          >
            已有账号
          </span>
          <span
            v-if="show === login.forgot"
            class="text-[#1677FF] cursor-pointer hover:opacity-20"
            @click="handleChange(login.login)"
          >
            去登陆?
          </span>
        </a-form-item>
        <!--        登录注册-->
        <a-form-item>
          <a-button
            v-if="show === login.login"
            :disabled="!disabled"
            type="primary"
            html-type="submit"
            class="login-form-button h-[40px] text-[15px]"
          >
            登录
          </a-button>
          <a-button
            v-if="show === login.register"
            :disabled="!disabled"
            type="primary"
            html-type="submit"
            class="login-form-button h-[40px] text-[15px]"
          >
            注册
          </a-button>
          <a-button
            v-if="show === login.forgot"
            :disabled="!disabled"
            type="primary"
            html-type="submit"
            class="login-form-button h-[40px] text-[15px]"
          >
            重置密码
          </a-button>
        </a-form-item>
        <!--        快捷登录-->
        <a-form-item>
          <span>快捷登录</span>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
  <AntModal
    :open="open"
    title="发送验证码"
    :okBtn="{
      text: '发送验证码',
      type: 'primary'
    }"
    @cancel="cancel"
    @ok="sendCode"
  >
    <div>
      <a-form>
        <a-form-item>
          <span class="mr-[25px]">邮箱:</span>
          <span>{{ formState.email }}</span>
        </a-form-item>
        <a-form-item label="验证码" name="model-code">
          <a-input placehoder="输入验证码"></a-input>
        </a-form-item>
      </a-form>
    </div>
  </AntModal>
</template>

<style scoped lang="scss">
.bg {
  display: flex;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/img.png');
  background-size: cover;

  .login-bg {
    background-image: url('@/assets/working.png');
    height: 50%;
    width: 50%;
    background-size: cover;
  }
}
.login-account {
  float: right;
}
.login-form-button {
  width: 100%;
}
</style>
