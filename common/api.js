//结合vuex使用
import * as apiUrl from './apiUrl.js'
import http from '@/common/http.js'
// 此处没有使用传入的params参数
// 此处使用了传入的params参数，一切自定义即可
const apiObj = apiUrl.default.reduce((t, item) => {
  // 如果是二级路由 则变成 下换线形式
  if (item.indexOf('/') > -1) {
    let a = item.replace('/', '_')
    t[a] = (_, data) => http.post(item, data)
    return t
  }
  t[item] = (_, data) => http.post(item, data)
  return t
}, {})

// #ifdef H5
// 获取授权参数
// #endif
if (process.env.NODE_ENV == 'development') {
  console.log(`使用了${Object.keys(apiObj).length}个接口`)
}

export default apiObj
