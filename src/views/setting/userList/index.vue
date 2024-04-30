<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MyTable from '@/components/table/index.vue'
import {
  changeUserTotalSpace,
  deleteUserApi,
  getAllUserListApi,
  SearchUserApi
} from '@/apis/settings.ts'
import { avatarImageUrl } from '@/data/common.ts'
import type { SingleUserInfo } from '@/apis/types/settings.ts'
import moment from 'moment'
import { message } from 'ant-design-vue'
import AntModal from '@/components/ant-modal/ant-modal.vue'
import ChangePassword from '@/views/lay-out/components/change-password.vue'
const selected = ref()
const value1 = ref('lucy')

//用户列表
const UserList = ref()
const columData = ref([
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '空间使用',
    dataIndex: 'useSpace',
    key: 'useSpace'
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
    key: 'joinTime'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate'
  }
])
//#region 获取用户列表
const userList = ref()
const getUserList = async () => {
  try {
    const res = await getAllUserListApi()
    userList.value = res.data.map((item: SingleUserInfo) => {
      return {
        id: item.id,
        avatar: item.avatar,
        nickname: item.nickName,
        email: item.email,
        joinTime: moment(item.joinTime).format('YYYY-MM-DD'),
        useSpace: item.useSpace
      }
    })
  } catch (e) {
    console.log(e, '获取用户列表的接口出错了')
  }
}
//#endregion

//#region 查询用户
const nickName = ref('')
const searchUser = async () => {
  const res = await SearchUserApi(nickName.value)
  //重新获取用户信息
  userList.value = res.data.map((item: SingleUserInfo) => {
    return {
      id: item.id,
      avatar: item.avatar,
      nickname: item.nickName,
      email: item.email,
      joinTime: moment(item.joinTime).format('YYYY-MM-DD'),
      useSpace: item.useSpace
    }
  })
}

//#endregion
const userId = ref('')
//#region 修改空间的弹窗
const visibleSpace = ref(false)
const space = ref('')
const changeSpace = (id: string) => {
  visibleSpace.value = true
  userId.value = id
}
const handleSpace = async () => {
  if (!Number(space.value) || !space.value) {
    message.error('请输入数字')
    return
  } else {
    try {
      const res = await changeUserTotalSpace(userId.value, Number(space.value))
      if (res.code === 0) {
        closeSpaceModal()
        message.success('修改成功')
      } else {
        message.error('修改失败')
      }
    } catch (e) {
      console.log(e, '更新用户空间接口出错了')
    }
  }
}
const closeSpaceModal = () => {
  visibleSpace.value = false
}
//#endregion

//#region 删除成员
const deleteUser = async (id: string) => {
  open.value = true
  userId.value = id
}
//#endregion

//#region 弹窗打开与关闭
const open = ref(false)
const close = () => {
  open.value = false
}
const handleOk = async () => {
  open.value = false
  try {
    const res = await deleteUserApi(userId.value)
    if (res.code === 0) {
      message.success('删除成功')
      //重新获取数据
      await getUserList()
    } else {
      message.error('删除失败')
    }
  } catch (e) {
    console.log(e, '删除用户的接口出错了')
  }
}
//#endregion

//#region 修改密码弹窗
const visiblePassword = ref(false)
const openPasswordModal = (id: string) => {
  userId.value = id
  visiblePassword.value = true
}
const cancel = () => {
  visiblePassword.value = false
}

//#endregion

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div>
    <!--    查询栏-->
    <div class="flex flex-row items-center pl-[20px] pt-[20px]">
      <div class="flex flex-row items-center mr-[20px]">
        <label class="mr-[10px] shrink-0">用户昵称</label>
        <a-input placeholder="支持模糊搜索" v-model:value="nickName"></a-input>
      </div>
      <div class="flex flex-row mr-[10px] items-center">
        <label class="mr-[10px] shrink-0">状态</label>
        <a-select ref="select" v-model:value="value1" style="width: 200px">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled" disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="searchUser">查询</a-button>
    </div>
    <!--    table-->
    <div class="mt-[20px]">
      <MyTable :add="true" :data="userList" ext-height="" :columns="columData">
        <template #bodyCell="{ column, record, index }">
          <!--          头像-->
          <template v-if="column.key == 'avatar'">
            <img
              :src="avatarImageUrl + record.avatar"
              alt="头像"
              style="width: 50px; height: 50px"
            />
          </template>
          <!--          操作-->
          <template v-if="column.key === 'operate'">
            <div class="flex">
              <div
                class="mr-[5px] text-[#05A1F5]"
                style="cursor: pointer"
                @click="openPasswordModal(record.id)"
              >
                修改密码
              </div>
              <div
                class="mr-[5px] text-[#E5AD6A]"
                style="cursor: pointer"
                @click="changeSpace(record.id)"
              >
                修改空间
              </div>
              <div class="text-[#FF0000]" style="cursor: pointer" @click="deleteUser(record.id)">
                删除
              </div>
            </div>
          </template>
        </template>
      </MyTable>
    </div>
  </div>
  <!--  删除弹窗-->
  <div>
    <a-modal v-model:open="open" :footer="false">
      <div class="pl-[10px] text-[18px]">确定要删除吗</div>
      <div class="pl-[20px] mt-[20px] text-[15px]">
        当删除了这个人就不能再次恢复了,请谨慎删除!!!
      </div>
      <div class="pl-[20px] pr-[20px] flex justify-end">
        <a-button class="mr-[10px]" type="primary" @click="close">取消</a-button>
        <a-button danger @click="handleOk">确定</a-button>
      </div>
    </a-modal>
  </div>
  <!--  修改密码弹窗-->
  <!--  修改密码-->
  <ChangePassword :open="visiblePassword" @cancel="cancel" :userId="userId"></ChangePassword>
  <!--  修改用户空间的弹窗-->
  <AntModal
    :open="visibleSpace"
    @close="closeSpaceModal"
    title="修改用户空间"
    show-cancel
    :ok-btn="{
      text: '确定'
    }"
    @ok="handleSpace"
  >
    <div>
      <a-input v-model:value="space"></a-input>
    </div>
  </AntModal>
</template>

<style lang="scss" scoped>
.ant-modal-content {
  padding: 20px 20px !important;
}
:deep(.ant-modal-footer) {
  padding-right: 20px;
}
</style>
