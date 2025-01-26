//校验是否有登录
// 保留几位小数
import { APP_CONFIG,DEBUG} from '@/common/config.js'
import store from "@/store"
function asyncD(arr) {
  return new Promise((resolve, reject) => {
    if (arr[0]) {
      reject(arr[0])
    } else {
      resolve(arr[1])
    }
  })
}
export function toFixed(str, L = 2) {
  let num = parseFloat(str)

  return num.toFixed(L)
}
// 解析url
export const parseQuery =()=> {
 
    const res = {};

    const query = (location.href.split("?")[1] || "")
      .trim()
      .replace(/^(\?|#|&)/, "");

    if (!query) {
      return res;
    }
    query.split("&").forEach(param => {
      const parts = param.replace(/\+/g, " ").split("=");
      const key = decodeURIComponent(parts.shift());
      const val = parts.length > 0 ? decodeURIComponent(parts.join("=")) : null;

      if (res[key] === undefined) {
        res[key] = val;
      } else if (Array.isArray(res[key])) {
        res[key].push(val);
      } else {
        res[key] = [res[key], val];
      }
    });

    return res;
  }
//缓存封装
export function Cache(key, value, seconds) {
	
  //缓存,默认有效期28天
  try{
    var timestamp = Date.parse(new Date()) / 1000
    if (key && (value === null || value === undefined)) {
      //删除缓存
      //获取缓存
      var val = uni.getStorageSync(key)
      if(!val || typeof val != 'string') return '';
      var tmp = val.split('|')
      if (!tmp[1] || timestamp >= tmp[1] || value === null) {
        console.log(key + '已失效')
        uni.removeStorageSync(key)
        return ''
      } else {
        try {
          return JSON.parse(tmp[0])
        } catch (e) {
          return tmp[0]
        }
      }
    } else if (key && value) {
		
      //设置缓存
      if (!seconds) {
        var expire = timestamp + 3600 * 24 * 30 //默认30天过期
      } else {
        var expire = timestamp + seconds
      }
      if (typeof value == 'object') {
        value = JSON.stringify(value)
      }
      value = value + '|' + expire
      uni.setStorageSync(key, value)
    } else {
      console.log('key不能空')
    }
  }catch (e){
     console.log(e)
  }
}

//app常用方法封装
export async function autoLogin(info) {
  try {
    let code
    let infoArr
    let codeArr
    let cache_key = Cache('cache_key')
    let req = {}
    //除了H5都调用此方法
    if (DEBUG) return await dispatch('user_oAuthLogin', {
      uniqueId: "ad296dea4370fb6808b19b69e0da54cf",
      cache_key: "184b911db78284ac0c840ccc87054618"
    })
    if (!cache_key) {
      //#ifndef APP-PlUS
      codeArr = await uni.login()
      code = await asyncD(codeArr)
      console.log("code",code)
      //#endif

      //#ifdef APP-PlUS
      const ProviderArr = await uni.getProvider({
        service: 'oauth',
      })
      const Provider = await asyncD(ProviderArr)
      if (!~provider.indexOf('weixin')) return uni.$u.toast('登录失败')
      codeArr = await uni.login({onlyAuthorize: true, provider: 'weixin'})
      code = await asyncD(codeArr)
      infoArr = await uni.getUserInfo({withCredentials: true})
      info = await asyncD(infoArr)
      //#endif
    }
    //微信小程序
    // #ifdef MP-WEIXIN
    infoArr = uni.getUserProfile({desc: '用户信息'})
    info = await asyncD(infoArr)
    // #endif

    //其他小程序
    //#ifndef APP-PlUS | MP-WEIXIN
    info = JSON.stringify(info)
    //#endif

    req.cache_key = cache_key
    req.code = code ? code.code : ''
    req.userInfo = info

    const res = await store.dispatch('user_oAuthLogin', req)
    if (res.data.cache_key) Cache('cache_key', res.data.cache_key, 60 * 60 * 2)
    return res.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export function Backurl() {
  let back_url = Cache('back_url') ? Cache('back_url') : APP_CONFIG.INDEX_PAGE
  let type = 'redirectTo'
  if (back_url.indexOf('tabbar')!==-1) {
    type = 'switchTab'
  }
  Cache('back_url', null)
  uni.$u.route({
    url: back_url,
    type,
  })
}
//获取当前页面的地址
export function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options
  console.log(options)
  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}
export const iswx = () => {
  // #ifdef H5
  var ua = window.navigator.userAgent.toLowerCase()
  if (
    ua.match(/MicroMessenger/i) == 'micromessenger' ||
    ua.match(/QQ/i) == 'qq'
  ) {
    return true
  } else {
    return false
  }
  // #endif
  // #ifndef H5
  return false
  // #endif
}
// 获取当前用户设置 1为获取成功 2获取失败
export const getSetting = function (Setting) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === undefined) {
          resolve(0)
          return
        }
        if (res.authSetting['scope.userLocation']) {
          resolve(1)
        } else {
          resolve(2)
        }
      },
    })
  })
}
// 获取打开用户设置 1为获取成功 2获取失败
export const openSetting = function (auth) {
  return new Promise((resolve, reject) => {
    uni.openSetting({
      success: (res) => {
        if (res.authSetting && res.authSetting[auth]) {
          resolve(1)
        } else {
          resolve(2)
        }
      },
      fail: (err) => {
        resolve(2)
      },
    })
  })
}

// 获取定位

export const doGetLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        console.log(err)
        // #ifndef MP-BAIDU
        if (err.errMsg.indexOf('auth deny') >= 0) {
          reject('访问位置被拒绝,定位失败')
        } else {
          reject('定位失败')
        }
        // #endif
      },
    })
  })
}
