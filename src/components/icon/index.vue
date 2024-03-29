<script setup lang="ts">
//定义类型
const props = defineProps({
  fileType: {
    default: 10,
    type: Number
  },
  cover: String,
  iconName: String,
  getImage: Function,
  width: {
    type: String,
    default: '30'
  },
  height: {
    type: String,
    default: '30'
  }
})

const FileType = {
  0: { desc: '目录', icon: 'folder' },
  1: { desc: '视频', icon: 'video' },
  2: { desc: '音频', icon: 'music' },
  3: { desc: '图片', icon: 'image' },
  4: { desc: 'exe', icon: 'pdf' },
  5: { desc: 'doc', icon: 'word' },
  6: { desc: 'excel', icon: 'excel' },
  7: { desc: '纯文本', icon: 'txt' },
  8: { desc: '程序', icon: 'code' },
  9: { desc: '压缩包', icon: 'zip' },
  10: { desc: '其他文件', icon: 'others' }
}

const getImage = () => {
  if (props.cover) {
    //获取文件图片的路径
    return 'http://localhost:3000/statics/' + props.cover
  }
  let icon = 'unknown_icon'
  if (props.iconName) {
    icon = props.iconName
  } else {
    const iconMap = (FileType as any)[props.fileType]
    if (iconMap != undefined) {
      icon = iconMap.icon
    }
  }
  return new URL(`/src/assets/icon-image/${icon}.png`, 'http://localhost:5173').href
}
</script>

<template>
  <span>
    <img
      :src="getImage()"
      alt=""
      :style="{
        width: width + 'px',
        height: height + 'px'
      }"
    />
  </span>
</template>

<style scoped lang="scss"></style>
