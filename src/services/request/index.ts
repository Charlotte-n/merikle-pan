import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { HYRequestConfig } from './type'
import { useUserInfo } from '@/stores/userInfo.ts'
import { useStorage } from '@/hooks/useStorage.ts'
import { message } from 'ant-design-vue'
import { useCommonStore } from '@/stores/common.ts'
// 拦截器: 蒙版Loading/token/修改配置
/**
 * 两个难点:
 *  1.拦截器进行精细控制
 *    > 全局拦截器
 *    > 实例拦截器
 *    > 单次请求拦截器
 *
 *  2.响应结果的类型处理(泛型)
 */

class HYRequest {
  instance: AxiosInstance

  // request实例 => axios的实例
  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)

    // 每个instance实例都添加拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        const CommonStore = useCommonStore()
        // loading/token
        if (useUserInfo().token) {
          const token = useUserInfo().token
          if (token) {
            config.headers.set('Authorization', token)
          }
        }
        //loading
        if (config.showLoading) {
          CommonStore.openSpinning()
        } else {
          CommonStore.closeSpinning()
        }
        return config
      },
      (err) => {
        const CommonStore = useCommonStore()
        CommonStore.closeSpinning()
        message.error('请求发送失败')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res: any) => {
        const CommonStore = useCommonStore()
        const { showLoading } = res.config
        if (showLoading) {
          CommonStore.closeSpinning()
        }
        if (res.data.data?.token) {
          const token = 'Beare ' + res.data.data?.token
          useUserInfo().updateToken(token)
        }
        return res.data
      },
      (err) => {
        console.log(err)
        //登录过期了
        if (err.response?.data.code === 401) {
          message.warn('登录过期,请重新登录')
          window.location.href = 'http://localhost:5173/login'
        }
        return err.response.data
      }
    )
  }

  // 封装网络请求的方法
  // T => IHomeData
  request<T = any>(config: HYRequestConfig<T>) {
    // 单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    // 返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单词响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: HYRequestConfig<T>) {
    return this.request({
      ...config,
      method: 'GET'
    })
  }
  post<T = any>(config: HYRequestConfig<T>) {
    return this.request({
      ...config,
      method: 'POST',
      onUploadProgress(event) {
        if (config.onUploadProgress) {
          config.onUploadProgress(event)
        }
      }
    })
  }
  delete<T = any>(config: HYRequestConfig<T>) {
    return this.request({
      ...config,
      method: 'DELETE'
    })
  }
  patch<T = any>(config: HYRequestConfig<T>) {
    return this.request({
      ...config,
      method: 'PATCH'
    })
  }
}

export default HYRequest
