export const upload = async (api: any, ruleForm: any) => {
  const param = new FormData()
  for (const i in ruleForm) {
    //传入key和value
    param.append(i, ruleForm[i])
  }
  //将这个数据传递给后端进行ajax请求
  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  return await api(param, headers)
}
