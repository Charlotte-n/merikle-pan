<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { changeAvatarApi, GetUserInfo } from '@/apis/user.ts'
import { useUserInfo } from '@/stores/userInfo.ts'

const props = defineProps<{
  open: boolean
}>()
const emits = defineEmits(['cancel'])
const cancel = () => {
  emits('cancel')
}

//上传头像
function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

const fileList = ref<any>([])

const handleCancel = () => {
  previewVisible.value = false
  previewTitle.value = ''
}
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    return message.warn('请上传图片')
  }
  const formData = new FormData()
  fileList.value?.forEach((file: any) => {
    formData.append('files[]', file as any)
  })
  let length: number = fileList.value!.length as number
  formData.append('file', fileList.value[length - 1].originFileObj, 'image.png')
  const res = await changeAvatarApi(useUserInfo().userInfo._id, formData)
  if (res.code === 0) {
    //重新获取用户信息
    const res = await GetUserInfo(useUserInfo().userInfo._id)
    useUserInfo().updateUserInfo(res.data)
    message.success('头像修改成功')
    cancel()
  }
}
const beforeUpload = (file: any) => {
  fileList.value = [...(fileList.value || []), file]
  return false
}
defineExpose({ a: 123 })
</script>

<template>
  <Modal
    :open="props.open"
    :title="$t('user.avatar')"
    show-cancel
    @close="cancel"
    :btn-other-show="false"
    :ok-btn="{
      text: $t('common.confirm')
    }"
  >
    <div class="pl-[20px] pt-[20px] pb-[20px]">
      <div>
        <span class="mr-[20px] text-[#97999B]">{{ $t('user.nickname') }}</span>
        <!--       死页面-->
        <span>Merikle</span>
      </div>
      <div class="flex items-center mt-[20px]">
        <span class="mr-[10px] text-[#97999B] inline-block w-[50px]">{{
          $t('user.avatar.value')
        }}</span>
        <div>
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            list-type="picture-card"
            @preview="handlePreview"
          >
            <div v-if="fileList!.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
          <a-modal
            :open="previewVisible"
            :title="previewTitle"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>

        <div class="ml-[20px]">
          <a-button type="primary" @click="handleUpload"> {{ $t('user.avatar') }} </a-button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss"></style>
