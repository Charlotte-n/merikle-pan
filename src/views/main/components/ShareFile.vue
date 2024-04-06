<script setup lang="ts">
import AntModal from '@/components/ant-modal/ant-modal.vue'
import { onMounted, reactive, ref } from 'vue'
import { imageUrlBase, UrlBase } from '../../../data/common.ts'
import type { ShareLinkParam } from '@/apis/types/share.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import { createShareLinkApi } from '@/apis/share.ts'
import useClipboard from 'vue-clipboard3'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
const { toClipboard } = useClipboard()
const props = defineProps<{
  fileName: string
  show: boolean
  fileCover: string
  fileId: string
}>()
const emits = defineEmits(['close'])
const showLink = ref(false)
const formRef = ref()
const route = useRoute()

const copy = async () => {
  await toClipboard(`链接: ${UrlBase + '/' + 'shareCheck/' + props.fileId} , 提取码:${code.value}`)
  message.success('复制成功')
}
//确定按钮
const open = () => {
  //进行判断是什么界面
  if (!showLink.value) {
    //首先进行检验
    formRef.value
      .validate()
      .then((res: any) => {
        console.log(res)
      })
      .catch((error: any) => {
        console.log('error', error)
        return
      })
    // 创建链接
    createShareLink()
    //打开生成链接弹窗
    showLink.value = true
    formState.code = ''
    formState.validTime = '1'
    formState.selectValue = '1'
  } else {
    //进行复制
    copy()
  }
}
const close = () => {
  showLink.value = false
  emits('close')
}
//规则
const rules = {
  validTime: [{ required: true, message: 'Please input Activity name', trigger: 'click' }],
  selectValue: [{ required: true, message: '请选择code类型', trigger: 'click' }],
  code: [
    { required: true, message: '请填入邀请码', trigger: 'blur' },
    { min: 4, max: 6, message: '最短为4个,最长为6个', trigger: 'blur' }
  ]
}
const formState = reactive({
  code: '',
  validTime: '1',
  selectValue: '1'
})
const userStore = useUserInfo()
const code = ref()
//生成分享链接
const createShareLink = async () => {
  const params = ref<ShareLinkParam>({
    code: formState.code,
    validTime: Number(formState.validTime),
    userId: (userStore.userInfo as { _id: string })._id,
    fileId: props.fileId
  })
  try {
    const res = await createShareLinkApi(params.value)
    //获取到code
    code.value = res.data.code
  } catch (e) {
    console.log(e, '创建分享链接出错了createShareLinkApi')
  }
}
onMounted(() => {
  console.log(route)
})
</script>

<template>
  <AntModal
    :width="700"
    :btn-other-show="false"
    :open="props.show"
    title="分享"
    :show-cancel="true"
    :ok-btn="{
      text: showLink ? '复制链接及其提取码' : '确定'
    }"
    @ok="open"
    @close="close"
  >
    <div>
      <a-form :rules="rules" ref="formRef" :model="formState">
        <div v-if="!showLink" class="pt-[20px] pl-[40px] pr-[40px]">
          <a-form-item>
            <div>文件 {{ props.fileName }}</div>
          </a-form-item>
          <a-form-item name="validTime">
            <label class="mr-[15px]">有效期</label>
            <a-radio-group v-model:value="formState.validTime" name="radioGroup">
              <a-radio value="1">1天</a-radio>
              <a-radio value="2">7天</a-radio>
              <a-radio value="3">30天</a-radio>
              <a-radio value="4">永久有效</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="selectValue">
            <label class="mr-[15px]">提取码</label>
            <a-radio-group v-model:value="formState.selectValue" name="radioGroup">
              <a-radio value="1">自定义</a-radio>
              <a-radio value="2">系统生成</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            style="width: 200px"
            class="ml-[50px]"
            v-if="formState.selectValue === '1'"
            name="code"
          >
            <a-input placeholder="请输入5位提取码" v-model:value="formState.code"></a-input>
          </a-form-item>
        </div>
        <div v-else class="pt-[20px] pl-[40px] pr-[40px]">
          <a-form-item>
            <div>文件 {{ props.fileName }}</div>
          </a-form-item>
          <a-form-item>
            <div>分享链接 {{ UrlBase + 'shareCheck/' + fileId }}</div>
          </a-form-item>
          <a-form-item>
            <div>提取码 {{ code }}</div>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </AntModal>
</template>

<style scoped lang="scss"></style>
