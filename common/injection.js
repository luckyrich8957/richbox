import { APP_CONFIG, DEBUG } from "@/common/config.js";
import { Cache } from "@/utils/util";
import * as util from "@/utils/util";
import * as config from "@/common/config.js";
import { getCurrentPageUrlWithArgs } from "@/utils/util";
import map from "../pages/good/map";

/**
 *注入全局方法
 */
let navigateFlag = false;
export const $authRoute = (o, auth = 1) => {
	
  if (navigateFlag) return false;
  // debugger
  console.log('到这里了');
  navigateFlag = true;
  o.animationType = o.animationType ? o.animationType : "pop-in";
  if (auth && !Cache("token")) {
    if (getCurrentPageUrlWithArgs().indexOf("login") !== -1) return;
    Cache("back_url", getCurrentPageUrlWithArgs());
    uni.$u.toast("您还未登录，请先登录！");
	navigateFlag = false;
    return uni.$u.route({
      url: config.APP_CONFIG.LOGIN,
      type: "reLaunch",
      animationType: o.animationType,
      params: o.params ? o.params : {},
    });
    
  }
  if (typeof o.url == "string" && o.url.search(/https:\/\/|http:\/\//) > -1) {
    o.url = "pages/web/web?link=" + o.url;
    uni.$u.route(o);
    setTimeout(() => {
      navigateFlag = false;
    }, 200);
    return true;
  }
  if (o.url.indexOf("tabbar") !== -1) {
    o.type = "switchTab";
  }
  console.log("跳转。。。。", o,navigateFlag);
  uni.$u.route(o);
  setTimeout(() => {
    navigateFlag = false;
  }, 200);
};

export const getChooseImage = (type) => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      sourceType: type,
      count: 9,
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
      success: (res) => {
        res.tempFilePaths.forEach((src) => {
          let srcImg = src;
          let name = srcImg.substr(srcImg.lastIndexOf("/") + 1); //截取文件名
          let msg = { file: src };
          uni.getImageInfo({
            src: src,
            success: (image) => {
              msg = {
                ...msg,
                width: image.width,
                height: image.height,
              };

              //#ifdef APP-PLUS
              plus.zip.compressImage(
                {
                  src: srcImg,
                  dst: "_doc/chatImage/" + name, //把图片重新保存到该目录下
                  overwrite: true, //如果同名则覆盖文件
                  quality: 25, //压缩比率，越大质量越好,不要用100出来比原文件还大一倍
                },
                function (data) {
                  msg.file = data.target;
                  //#ifndef APP-PLUS
                  resolve(msg);
                  //#endif
                },
                function (error) {
                  resolve(msg);
                }
              );
              //#endif
              //#ifndef APP-PLUS
              resolve(msg);
              //#endif
            },
            fail(res) {
              reject(res);
            },
          });
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  });
};
const install = (Vue, vm) => {
  Vue.prototype.$getUrlParams = (param, k, p) => {
    if (typeof param != "string") return {};
    k = k ? k : "&"; //整体参数分隔符
    p = p ? p : "="; //单个参数分隔符
    var value = {};
    if (param.indexOf(k) !== -1) {
      param = param.split(k);
      for (var val in param) {
        if (param[val].indexOf(p) !== -1) {
          var item = param[val].split(p);
          value[item[0]] = item[1];
        }
      }
    } else if (param.indexOf(p) !== -1) {
      var item = param.split(p);
      value[item[0]] = item[1];
    } else {
      return param;
    }
    return value;
  };
  // 注入全局方法 缓存
  Vue.prototype.$cache = Cache;
  //是否是debug模式
  Vue.prototype.$is_debug = DEBUG;
  //全局工具方法
  Vue.prototype.$util = util;
  //全局配置
  Vue.prototype.$config = config;
  //小时转分钟
  Vue.prototype.$hoursToMinites = (str) => {
    if (str !== "0" && str !== "" && str !== null) {
      let time = (
        Math.floor(str / 60) + parseFloat(((str % 60) / 60).toFixed(2))
      ).toFixed(2);

      return isNaN(time) ? "" : time + "小时";
    } else {
      return "";
    }
  };
  //拨打电话
  Vue.prototype.$callPhone = (phone) => {
    const res = uni.getSystemInfoSync();
    // ios系统默认有个模态框
    if (res.platform == "ios") {
      uni.makePhoneCall({
        phoneNumber: phone,
        success() {},
        fail() {},
      });
    } else {
      uni.showActionSheet({
        itemList: [phone, "呼叫"],
        success: function (res) {
          console.log(res);
          if (res.tapIndex == 1) {
            uni.makePhoneCall({
              phoneNumber: phone,
            });
          }
        },
      });
    }
  };
  //延迟执行
  Vue.prototype.$sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  Vue.prototype.$authRoute = $authRoute;
  // 获取当前页面的url地址
  Vue.prototype.$getUrl = () => {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = "/" + currentPage.route; //当前页面url
    var options = currentPage.options; //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    var urlWithArgs = url + "?";
    for (var key in options) {
      var value = options[key];
      urlWithArgs += key + "=" + value + "&";
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

    return urlWithArgs;
  };
  // 多少秒后执行什么操作
  Vue.prototype.$t = function (title, cb, time = 1000, mask = true) {
    uni.showToast({
      icon: "none",
      title,
      mask: mask,
      success: () => {
        if (cb) {
          setTimeout((_) => {
            cb();
          }, time);
        }
      },
    });
  };
  // 判断必要参数
  Vue.prototype.$p = (p, arr) => {
    return arr.every((item) => item in p);
  };
  // 判断登录状态
  Vue.prototype.$auth = (cb) => {
    // 如果未登录
    if (!Cache("token")) {
      Cache("back_url", getCurrentPageUrlWithArgs());
      Vue.prototype.$t("您还未登录，请先登录！", () => {
        uni.$u.route(APP_CONFIG.LOGIN, {
          type: "redirectTo",
        });
      });
      return false;
    } else {
      cb && cb();
      return true;
    }
  };
  // 是否是微信H5
  Vue.prototype.$iswx = () => {
    // #ifdef H5
    var ua = window.navigator.userAgent.toLowerCase();
    if (
      ua.match(/MicroMessenger/i) == "micromessenger" ||
      ua.match(/QQ/i) == "qq"
    ) {
      return true;
    } else {
      return false;
    }
    // #endif
    // #ifndef H5
    return false;
    // #endif
  };
  // 封装缓存

  // 上传文件
  Vue.prototype.$upload = function (url) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: APP_CONFIG.UPLOAD,
        filePath: url,
        header: {
          Authorization: "Bearer " + Cache("token"),
        },
        name: "file",
        success(res) {
          const data = uni.$u.test.jsonString(res.data)
            ? JSON.parse(res.data)
            : res.data;
          resolve(data);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  };
  // 判断是否登录
  Vue.prototype.$isLogin = function () {
    return Cache("token");
  };
  // 判断是否登录
  Vue.prototype.$toast = function (title) {
    return uni.$u.toast(title);
  };
  Vue.prototype.$loading = function (msg = "", success, fail) {
    return uni.showLoading({
      title: msg,
      success: success,
      fail: fail,
    });
  };
  Vue.prototype.hideLoading = function () {
    return uni.hideLoading();
  };
  Vue.prototype.$copy = function (msg) {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data: msg,
        success() {
          resolve();
        },
        fail(error) {
          reject(error);
        },
      });
    });
  };
  /**
   * 统一下单接口
   * @param order_id
   * @param order_type
   * @param trade_type
   * @param redirect_url
   * @param fail_url
   */
  Vue.prototype.$jumpPay = function (
    order_id,
    order_type = "rechargeOrder",
    trade_type = "alipay",
    redirect_url,
    fail_url
  ) {
    uni.showLoading({
      title: "正在前往收银台...",
    });
    setTimeout(() => {
      let payParams = {};
      payParams.order_id = order_id;
      payParams.trade_type = trade_type;
      payParams.order_type = order_type;
      payParams.redirect_url = redirect_url;
      payParams.fail_url = fail_url;
      $authRoute({
        url: "/pages/order/checkstand",
        type: "redirectTo",
        params: payParams,
      });
    }, 500);
  };
};

export default {
  install,
  $authRoute,
};
