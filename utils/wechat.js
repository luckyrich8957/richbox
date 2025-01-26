// #ifdef H5
import WechatJSSDK from '@/js_sdk/jweixin-module/index.js'
import { parseQuery } from '@/utils/util.js'
// import {
//     getWechatConfig,
//     wechatAuthV2
// } from "@/api/public";
import api from '@/common/api.js'
// console.log(api,'api');
import { WX_AUTH, STATE_KEY, LOGINTYPE, BACK_URL } from '@/common/config'
import { Help, Cache } from '@/utils/util'
import store from '@/store'

class AuthWechat {
  constructor() {
    //微信实例化对象
    this.instance = WechatJSSDK
    //是否实例化
    this.status = false

    this.initConfig = {}
  }
  // 是否是安卓
  isAndroid() {
    let u = navigator.userAgent
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  }
  // 当前的url
  signLink() {
    if (typeof window.entryUrl === 'undefined' || window.entryUrl === '') {
      window.entryUrl = document.location.href
    }
    return /(Android)/i.test(navigator.userAgent)
      ? document.location.href
      : window.entryUrl
  }

  /**
   * 初始化wechat(分享配置)
   */
  // 初始化sdk 返回sdk实例
  wechat() {
    return new Promise((resolve, reject) => {
      // if (this.status && !this.isAndroid()) return resolve(this.instance);
      api
        .wechat_config()
        .then((res) => {
          // res.data.debug=true

          this.instance.config(res.data)
          this.initConfig = res.data
          this.status = true
          this.instance.ready((res) => {
            resolve(this.instance)
          })
        })
        .catch((err) => {
          console.log(err)
          this.status = false
          reject(err)
        })
    })
  }

  /**
   * 验证是否初始化
   */
  // 是否已初始化sdk
  verifyInstance() {
    let that = this
    return new Promise((resolve, reject) => {
      if (that.instance === null && !that.status) {
        that
          .wechat()
          .then((res) => {
            resolve(that.instance)
          })
          .catch(() => {
            return reject()
          })
      } else {
        return resolve(that.instance)
      }
    })
  }

  // 微信收货地址共享
  openAddress() {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.openAddress)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 获取经纬度；获取当前位置
  location() {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.getLocation, { type: 'wgs84' })
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 使用微信内置地图查看位置接口；
  // 输入位置来
  seeLocation(config) {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.openLocation, config)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 微信支付
   * @param {Object} config
   */
  pay(config) {
    return new Promise((resolve, reject) => {
      this.wechat()
        .then((wx) => {
          this.toPromise(wx.chooseWXPay, config)
            .then((res) => {
              resolve(res)
            })
            .catch((res) => {
              reject(res)
            })
        })
        .catch((res) => {
          reject(res)
        })
    })
  }

  toPromise(fn, config = {}) {
    return new Promise((resolve, reject) => {
      fn({
        ...config,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        },
        complete(err) {
          reject(err)
        },
        cancel(err) {
          reject(err)
        },
      })
    })
  }

  /**
   * 自动去授权
   */

  oAuth(snsapiBase, url) {
    if (Cache('authIng')) return
    debugger
    if (Cache(WX_AUTH) && store.state.token && snsapiBase == 'snsapi_base')
      return
    let { code } = parseQuery()
    let snsapiCode = Cache('snsapiCode')
    if (code instanceof Array) {
      code = code[code.length - 1]
    }
    if (snsapiCode instanceof Array) {
      snsapiCode = snsapiCode[snsapiCode.length - 1]
    }
    if (!code || code == snsapiCode) {
      Cache('authIng', true)
      return this.oAuth(snsapiBase, url)
    } else {
      if (Cache('snsapiKey'))
        return this.auth(code).catch((error) => {
          console.log(error)
          uni.showToast({
            title: error,
            icon: 'none',
          })
        })
    }
  }
  /**
   * 授权登陆获取token
   * @param {Object} code
   */
  auth(code) {
    return new Promise((resolve, reject) => {
      let loginType = Cache(LOGINTYPE)
      wechatAuthV2(code)
        .then(({ data }) => {
          Cache(WX_AUTH, code)
          Cache(STATE_KEY, null)
          resolve(data)
        })
        .catch(reject)
    })
  }

  /**
   * 获取跳转授权后的地址
   * @param {Object} appId
   * @param {String} snsapiBase snsapi_userinfo:授权登录  snsapi_base：静默登录
   */
  getAuthUrl(appId, snsapiBase, backUrl) {
    let url = `${location.origin}/${backUrl}`
    if (url.indexOf('?') == -1) {
      url = url + '?'
    } else {
      url = url + '&'
    }
    const redirect_uri = encodeURIComponent(
      `${url}scope=${snsapiBase}&back_url=` +
        encodeURIComponent(
          encodeURIComponent(
            Cache('back_url')
              ? Cache('back_url')
              : location.pathname + location.search
          )
        )
    )
    console.log(redirect_uri)
    const state = encodeURIComponent(
      ('' + Math.random()).split('.')[1] + 'authorizestate'
    )
    Cache(STATE_KEY, state)
    if (snsapiBase === 'snsapi_base') {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}&connect_redirect=1#wechat_redirect`
    } else {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}&connect_redirect=1#wechat_redirect`
    }
  }

  /**
   * 跳转自动登陆
   */
  toAuth(snsapiBase, backUrl) {
    let that = this
    this.wechat().then((wx) => {
      console.log(this.getAuthUrl(that.initConfig.appId, snsapiBase, backUrl))
      location.href = this.getAuthUrl(
        that.initConfig.appId,
        snsapiBase,
        backUrl
      )
    })
  }

  /**
   * 绑定事件
   * @param {Object} name 事件名
   * @param {Object} config 参数
   */
  wechatEvevt(name, config) {
    console.log(11111)
    let that = this
    return new Promise((resolve, reject) => {
      let configDefault = {
        fail(res) {
          console.log(res)
          if (that.instance)
            return reject({
              is_ready: true,
              wx: that.instance,
            })
          that.verifyInstance().then((wx) => {
            return reject({
              is_ready: true,
              wx: wx,
            })
          })
        },
        success(res) {
          console.log(res)
          return resolve(res, 2222)
        },
      }
      Object.assign(configDefault, config)
      that.wechat().then((wx) => {
        console.log(22222)
        if (typeof name === 'object') {
          name.forEach((item) => {
            wx[item] && wx[item](configDefault)
          })
        } else {
          wx[name] && wx[name](configDefault)
        }
      })
    })
  }

  isWeixin() {
    return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
  }
}

export default new AuthWechat()
// #endif
