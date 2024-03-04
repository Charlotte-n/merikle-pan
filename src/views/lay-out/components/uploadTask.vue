<script setup lang="ts">
import { PauseCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { SingleFileStatus } from '@/data/types/file.ts'
import SparkMD5 from 'spark-md5'
import { MergeApi, UploadChunkApi, VerifyStatusApi } from '@/apis/file.ts'
import type { MergeParam, VerifyStatusParam } from '@/apis/types/file.ts'
import { useUserInfo } from '@/stores/userInfo.ts'
import { fileList, STATUS } from '@/data/upload.ts'

const UserStore = useUserInfo()
const chunkSize = 1024 * 1024

const addFile = async (file: any, fileId: string | number) => {
  const fileItem = {
    file: file,
    //文件id
    uid: file.uid,
    //md5进度
    md5: '',
    md5Progress: 0,
    //文件名
    filename: file.name,
    //文件状态
    status: 'fail',
    //已上传文件的大小
    uploadSize: 0,
    //总文件的大小
    totalFileSize: file.size,
    //暂停
    pause: false,
    //当前分片
    chunkIndex: 0,
    //文件父级id
    filePid: fileId,
    //错误信息
    errorMsg: null,
    uploadProgress: 0
  }
  fileList.value.unshift(fileItem)
  if (fileItem.totalFileSize === 0) {
    fileItem.status = STATUS.emptyfile.value
    return
  }
  //计算md5,查一下这个是干什么的
  const md5FileUid = await computedMd5(fileItem)
  if (md5FileUid === null) {
    return
  }
  //进行上传文件
  await uploadChunk(fileItem.file.uid, fileItem.chunkIndex, fileItem.md5)
}

//做秒传的，不做妙传的话可以不写，前端使用md5，后端通过这个md5来进行查询是否有这个md5
const computedMd5 = (fileItem: SingleFileStatus): any => {
  let file = fileItem.file
  let blobSlice = file.slice || file.mozSlice || file.webkitSlice
  //进行切分,总的切片数目,应该向上取整
  const chunks = Math.ceil(file.size / chunkSize)
  let currentIndex = 0
  const spark = new SparkMD5.ArrayBuffer()
  //读取文件
  const fileReader = new FileReader()
  //进行加载下一部分file
  const loadNext = () => {
    //设置截取区间
    let start = currentIndex * chunkSize
    let end = start + chunkSize > file.size ? file.size : start + chunkSize
    //进行截取
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }
  loadNext()
  return new Promise((resolve, reject) => {
    let resultFile = getFileById(file.uid) as SingleFileStatus
    fileReader.onload = (e) => {
      spark.append(e.target!.result)
      //切片的增加
      currentIndex++
      if (currentIndex < chunks) {
        console.log(`第${currentIndex}个切片完成`)
        //计算进度
        fileItem.md5Progress = Math.ceil((currentIndex / chunks) * 100)
        //读取下一个
        loadNext()
      } else {
        //最后一个切片,结束md5
        let md5 = spark.end()
        spark.destroy()
        //进行设置文件状态
        resultFile.md5Progress = 1
        resultFile.md5 = md5
        resultFile.status = STATUS.uploading.value
        resolve(fileItem.uid)
      }
    }
    fileReader.onerror = (err) => {
      resultFile.md5Progress = -1
      resultFile.status = STATUS.fail.value
      reject(fileItem.uid)
    }
  }).catch((err) => {
    console.log(err)
    return null
  })
}

//上传切片
const uploadChunk = async (uid: string | number, chunkIndex: number, fileHash: string) => {
  chunkIndex = chunkIndex ? chunkIndex : 0
  //寻找文件
  let currentFile = getFileById(uid) as SingleFileStatus
  //进行切片
  const file = currentFile.file
  const fileSize = currentFile.totalFileSize
  const chunks = Math.ceil(fileSize / chunkSize)

  const judjeFileStatus = async () => {
    //判断文件状态
    const verifyStatusParam: VerifyStatusParam = {
      fileSize: file.size,
      user_id: UserStore.userInfo._id,
      fileHash: fileHash,
      totalCount: chunks,
      filename: file.name + '-' + chunkIndex,
      file_type: file.type
    }
    const verifyStatus = await VerifyStatusApi(verifyStatusParam)
    const data = verifyStatus.data
    if (data.length === 0 || data === '') {
      //秒传
      currentFile.md5Progress = 100
      currentFile.uploadProgress = 100
      currentFile.status = STATUS.upload_seconds.value
      return 0
    } else {
      //可能是断点续传或者是一个新的上传
      //上传中
      currentFile.status = STATUS.uploading.value
      return 1
    }
  }
  const res = await judjeFileStatus()
  if (res === 0) {
    return
  }
  //分片上传
  for (let i = chunkIndex; i < chunks; i++) {
    //当前文件如果停止传输就不去传输了
    if (currentFile.pause) {
      break
    }
    //进行切分循环上传
    const start = i * chunkSize
    const end = start + chunkSize > fileSize ? fileSize : start + chunkSize
    //需要上传的内容
    const fileChunk = file.slice(start, end)
    //上传内容
    const ruleForm = {
      chunkIndex: i,
      fileHash: fileHash,
      filename: file.name + '-' + chunkIndex,
      file_type: file.type
    }
    const otherForm = {
      currentFile: currentFile,
      fileSize: fileSize,
      index: i,
      chunkSize: chunkSize
    }
    const formData = new FormData()
    formData.append('file', fileChunk)

    await UploadChunkApi(formData, ruleForm, otherForm)
    if (chunks === i - 1) {
      currentFile.status = STATUS.upload_finish.value
    }
  }
  //最后一次上传
  if (
    currentFile.status === STATUS.upload_seconds.value ||
    currentFile.status === STATUS.upload_finish.value
  ) {
    //设置进度为100
    currentFile.uploadProgress = 100
    //进行合并
    const MergeParam: MergeParam = {
      filename: file.name,
      fileHash: fileHash,
      fileSize: fileSize,
      user_id: useUserInfo().userInfo._id,
      file_type: file.type
    }
    const res = await MergeApi(MergeParam)
    if (res.code === 0) {
      console.log(res, '合并成功了')
    }
  }
}

//根据id获取文件
const getFileById = (id: string | number) => {
  return fileList.value.find((item) => {
    return item.file.uid === id
  })
}
defineExpose({ addFile: addFile })
</script>

<template>
  <header
    class="popover-header pl-[10px] pr-[10px] pt-[10px] pb-[10px] border-b-[1px] border-solid border-[#DDDDDD] border-t-0 border-l-0 border-r-0"
  >
    <span>上传任务</span>
    <span class="text-[#AFAFAF] ml-[5px]">(仅展示本次上传任务)</span>
  </header>
  <main class="min-h-[450px] w-[800px]">
    <div class="text-center pt-[20px]" v-if="fileList.length === 0">
      <span class="text-center text-[#666666]">暂无上传任务</span>
    </div>
    <div v-else class="">
      <ul>
        <li
          v-for="item in fileList"
          :key="item.filename"
          :style="{
            borderBottom: '1px solid #DDDDDD'
          }"
          class="pl-[20px] pr-[20px] pt-[10px] pb-[10px]"
        >
          <div class="">{{ item.filename }}</div>
          <div class="flex">
            <!--            正常上传的状态-->
            <a-progress
              :percent="item.uploadProgress"
              v-if="
                item.status === STATUS.uploading.value ||
                item.status === STATUS.upload_seconds.value ||
                item.status === STATUS.upload_finish.value
              "
            ></a-progress>
            <!--            MD5进度条-->
            <a-progress
              :percent="item.md5Progress"
              type="circle"
              :size="40"
              v-if="item.status === STATUS.upload_seconds.value && item.md5Progress < 100"
            >
            </a-progress>
            <DeleteOutlined
              class="text-[20px] text-[#05A1F7] cursor-pointer"
              v-if="
                item.status === STATUS.upload_finish.value ||
                item.status === STATUS.upload_seconds.value
              "
            />
            <div v-else class="flex">
              <PauseCircleOutlined class="mr-[10px] text-[20px] text-[#05A1F7] cursor-pointer" />
              <CloseCircleOutlined
                class="text-[20px] text-[#05A1F7] cursor-pointer"
              ></CloseCircleOutlined>
            </div>
          </div>
          <div>
            <i
              :class="`iconfont mr-[10px] icon-` + STATUS[item.status].icon"
              :style="{
                color: STATUS[item.status].color
              }"
            ></i>
            <span
              :style="{
                color: STATUS[item.status].color
              }"
              >{{ STATUS[item.status].desc }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped lang="scss"></style>
