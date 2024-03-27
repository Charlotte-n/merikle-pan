import hyRequest from '@/services'

enum BASEURL {
  GET_FILE_STREAM = '/preview'
}

/**
 * 获取文件流
 * @param filename
 * @param type
 */
export const getFileStreamApi = (filename: string, type: any) => {
  return hyRequest.get({
    url: BASEURL.GET_FILE_STREAM + '/' + filename,
    responseType: type as any
  })
}
