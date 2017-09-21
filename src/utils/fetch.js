import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

axios.defaults.withCredentials = true // 支持cookie自动传入
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) { //暂不用token方式，用传统cookie方式；这里可以加入csrf验证规则
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非0是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code === 10302) {
      // 需要登录
      router.push({ path: '/login' })
      return Promise.reject('error')
    } else if (res.code === 10403) {
      // 没有权限
      router.push({ path: '/403' })
      return Promise.reject('error')
    } else if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
