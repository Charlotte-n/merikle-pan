<script setup lang="ts">
import { useUserInfo } from '@/stores/userInfo.ts'
import { onMounted, ref } from 'vue'
import { getImage } from '@/util/getImage.ts'
import { updateFileNameApi } from '@/apis/commonFile.ts'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import ShareModal from '@/views/ShareFile/c-pages/components/share-modal/ShareModal.vue'

const UserStore = useUserInfo()
const avatar = ref('')
const props = defineProps<{
  title: string
  exportPdf?: () => void
  exportExcel?: () => void
  category: number
}>()
const router = useRouter()
const route = useRoute()
const isChange = ref(false)
const name = ref('')
const updateName = async () => {
  const params = {
    id: route.params.id as string,
    name: name.value
  }
  const res = await updateFileNameApi(params)
  name.value = res.data.title
  isChange.value = false
  message.success('修改成功')
}
//改变名字
const handleChangeTitle = () => {
  isChange.value = true
}
//取消修改
const handleCancel = () => {
  isChange.value = false
}
//回到上一级
const gotoBack = () => {
  router.push('/commonFile/our')
}

//#region 分享modal
const open = ref(false)
const openModal = () => {
  open.value = true
}
const close = () => {
  open.value = false
}

//endregion
onMounted(() => {
  avatar.value = getImage(UserStore.userInfo.avatar)
})
</script>

<template>
  <div class="pl-[10px] pt-[10px] pr-[10px]">
    <div class="flex justify-between">
      <div class="flex items-center">
        <img
          @click="gotoBack"
          src="../../../../../assets/icon-image/home.png"
          alt=""
          class="h-[20px] w-[20px] cursor-pointer"
        />
        <div class="w-[1px] h-[10px] bg-[#cccccc] ml-[10px] mr-[10px]"></div>
        <div class="text-[15px] mr-[10px]" v-if="!isChange">{{ name ? name : title }}</div>
        <div v-else class="mr-[10px]">
          <a-input placeholder="修改名字" v-model:value="name"></a-input>
        </div>
        <div>
          <a-button type="primary" @click="handleChangeTitle" v-if="!isChange">修改</a-button>
          <div v-else>
            <a-button type="primary" class="mr-[10px]" @click="updateName">确定</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </div>
        <div class="mr-[20px]"></div>
        <div class="text-[10px] text-[#cccccc]">所有的编辑内容都会自动保存到云端</div>
      </div>
      <div class="flex items-center">
        <img
          class="mr-[10px] w-[25px] h-[25px] cursor-pointer"
          src="@/assets/icon-image/yaoqing.png"
          alt=""
        />
        <a-button type="primary" class="mr-[10px]" @click="openModal">分享</a-button>
        <div class="w-[1px] h-[10px] bg-[#cccccc] ml-[10px] mr-[10px]"></div>
        <div>
          <img :src="avatar" alt="用户头像" class="w-[50px] h-[50px]" style="border-radius: 10px" />
        </div>
      </div>
    </div>
  </div>
  <ShareModal
    :open="open"
    @close="close"
    :title="name ? name : title"
    @exportPdf="exportPdf"
    @exportExcel="exportExcel"
    :category="category"
  ></ShareModal>
</template>

<style scoped lang="scss">
.home {
  border-right: 1px solid #cccccc;
}
</style>
