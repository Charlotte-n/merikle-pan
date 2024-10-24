import { imageUrlBase } from '@/data/common'

const download = (fileInfo: any) => {
  // HomeHoverData.value[5].show = !fileInfo.folder_type
  window.location.href = imageUrlBase + fileInfo.fileCover
}

export default download
