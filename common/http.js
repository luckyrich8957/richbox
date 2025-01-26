import request from "uview-ui/libs/request";
import { Cache, getCurrentPageUrlWithArgs, iswx } from "@/utils/util";
import { APP_CONFIG, DEBUG } from "@/common/config.js";
import { $authRoute } from "@/common/injection";
import store from "@/store";

let from = "";
// #ifdef APP-PLUS
if (plus.os.name === "Android") from = "a_app";
else if (plus.os.name === "iOS") from = "i_app";
// #endif
// #ifdef H5
from = iswx() ? "wechat" : DEBUG ? "a_app" : "a_app";
// #endif
// #ifdef MP-WEIXIN
from = "wx_mini";
// #endif
// #ifdef MP-TOUTIAO
from = "dy_mini";
// #endif
// #ifdef MP-QQ
from = "qq_mini";
// #endif
// #ifdef MP-ALIPAY
from = "ali_mini";
// #endif

request.from = from;
request.interceptor.request = (config) => {
  // 可传值 app=app端,h5=普通H5战点,wechat=微信公众号,wx_mini,=微信小程序dy_mini=抖音小程序
  request.setConfig({
    baseUrl: APP_CONFIG.BASE_URL,
    loadingText: "努力加载中~",
    errorText: "服务器开了个小差",
    loadingTime: 800,
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  config.header.FormType = from;
  let token = "Bearer " + Cache("token");

  token && (config.header.Authorization = token);
  if (Cache("is_super_user") || store.state.is_super_user) {
    config.data.is_super_user =
      Cache("is_super_user") || store.state.is_super_user;
  }
  if (store.state.invite_id) {
    config.data.invite_id = store.state.invite_id;
  }
  // 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
  if (config.data.auth) {
    if (!Cache("token")) {
      uni.$u.toast("您还未登录");
      return false;
    }
    delete config.data.auth;
  }
  // 最后需要将config进行return
  return config;
  // 如果return一个false值，则会取消本次请求
  // if(config.url == '/user/rest') return false; // 取消某次请求
};

request.interceptor.response = (res) => {
  if (DEBUG) {
    console.log("res :>> ", res);
  }
  if (res.code == 200) {
    // res为服务端返回值，可能有code，result等字段
    // 这里对res.result进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
    // 如果配置了originalData为true，请留意这里的返回值
    return res;
  } else if (res.code == 410002) {
    // 假设201为token失效，这里跳转登录
    if (getCurrentPageUrlWithArgs().indexOf("login") !== -1) return;
    uni.$u.toast("验证失败，请重新登录");
    console.log(getCurrentPageUrlWithArgs());
    setTimeout(() => {
      //储存当前页面地址
      if (getCurrentPageUrlWithArgs().indexOf("login") !== -1) return;
      Cache("back_url", getCurrentPageUrlWithArgs());
      Cache("token", null);
      Cache("userinfo", null);
      // 此为uView的方法，详见路由相关文档
      uni.redirectTo({
        url: APP_CONFIG.LOGIN,
      });
    }, 1000);
    return false;
    //    信息未填写完整
  } else if (res.code == 20010) {
    //判断情况
    if (getCurrentPageUrlWithArgs().indexOf("login/phone") !== -1) return;
    //#ifdef MP-QQ || APP-PLUS
    setTimeout(() => {
      $authRoute(
        {
          url: "/pages/login/phone",
          params: res.data,
        },
        0
      );
    }, 500);
    //#endif
    //#ifdef MP-WEIXIN || MP-ALIPAY || H5
    setTimeout(() => {
      $authRoute(
        {
          url: "/pages/login/autoLogin",
          params: res.data,
        },
        0
      );
    }, 500);
    //#endif
    return false;
  } else {
    console.log(res.code);
    // 如果返回false，则会调用Promise的reject回调，
    // 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
    return false;
  }
};
export default request;
