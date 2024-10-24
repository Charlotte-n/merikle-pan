<script setup lang="ts">
import { ref } from 'vue'
import { initialSpaceApi } from '@/apis/settings'
import { message } from 'ant-design-vue'

const initialSpace = ref<string>('')
const AdminInitialSpace = async () => {
  try {
    const res = await initialSpaceApi(Number(initialSpace.value))
    if (res.code === 1 || res.code === 0) {
      message.success('更新成功')
      initialSpace.value = ''
    }
  } catch (e) {
    console.log(e, '初始化空间的接口出错了')
  }
}
</script>

<template>
  <div class="pl-[20px] pt-[20px]">
    <a-form>
      <a-form-item>
        <div class="flex items-center">
          <span class="w-[11%] mr-[10px]">初始化空间大小</span>
          <a-input class="w-[30%]" v-model:value="initialSpace"></a-input>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="AdminInitialSpace">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss"></style>
