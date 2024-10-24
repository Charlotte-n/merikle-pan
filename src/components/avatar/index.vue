<script setup lang="ts">
import { computed } from 'vue'
import { useUserInfo } from '@/stores/userInfo'
import { Avatar } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import type { AvatarProps } from '@/components/avatar/index'

const props = defineProps<AvatarProps>()
const { userInfo } = useUserInfo()
const { width, size } = props

const url = computed(() => userInfo?.avatar)
</script>

<template>
  <div>
    <img
      :src="url"
      v-if="url"
      alt=""
      :style="{
        width: width
      }"
    />
    <Avatar :size="size" v-else>
      <template #icon>
        <UserOutlined />
      </template>
    </Avatar>
  </div>
</template>

<style scoped lang="scss"></style>
