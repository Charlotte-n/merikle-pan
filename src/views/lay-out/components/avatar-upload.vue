<script setup lang="ts">
import uploadOutlined from '@ant-design/icons-vue/lib/icons/UploadOutlined'

const props = defineProps<{
  open: boolean
}>()
const emits = defineEmits(['cancel'])
const cancel = () => {
  emits('cancel')
}
</script>

<template>
  <Modal
    :open="props.open"
    title="修改头像"
    :okBtn="{
      text: '确定'
    }"
    show-cancel
    @close="cancel"
  >
    <div class="pl-[20px] pt-[20px] pb-[20px]">
      <div>
        <span class="mr-[10px] text-[#97999B]">昵称</span>
        <!--       死页面-->
        <span>Merikle</span>
      </div>
      <div class="flex items-center mt-[20px]">
        <span class="mr-[10px] text-[#97999B]">头像</span>
        <Avatar :size="90"></Avatar>
        <div class="self-end ml-[20px]">
          <a-upload>
            <a-button type="primary">
              <template #icon>
                <upload-outlined></upload-outlined>
              </template>
              上传
            </a-button>
          </a-upload>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped lang="scss"></style>
