import Vue from "vue";
import Vuex from "vuex";
import pay from "@/common/pay.js";
import api from "@/common/api.js";
import { APP_CONFIG, DEBUG } from "@/common/config.js";
import { openSetting, getSetting, doGetLocation, Cache } from "@/utils/util.js";
import chat from './modules/chat'
import payment from './modules/payment'
import shop from './modules/shop'
import blindbox from './modules/blindbox'
import admin from './modules/admin'
import danmaku from './modules/danmaku'
import viral from './modules/viral'

function asyncD(arr) {
  return new Promise((resolve, reject) => {
    if (arr[0]) {
      reject(arr[0]);
    } else {
      resolve(arr[1]);
    }
  });
}

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    chat,
    payment,
    shop,
    blindbox,
    admin,
    danmaku,
    viral,
    notifications: () => import('./modules/notifications')
  },
  state: {
    // 是否之前进入过首页
    one: true,
    option: {},
    payList: [],
    appConfig: null,
    invite_id: "",
    token: Cache("token") || "",
    userInfo: Cache("userInfo") || {},
    is_super_user: Cache("is_super_user") || 0,
    isLoading: false,
    systemMessage: null,
    paymentStatus: null, // 支付狀態：null-初始狀態, pending-處理中, paid-支付成功, failed-支付失敗
    cart: [] // 購物車
  },
  mutations: {
    setOne(state, data) {
      console.log('触发');
      state.one = data
      console.log();
    },
    setPayList(state, payload) {
      state.payList = payload;
    },
    setOption(state, data) {
      console.log(data, '到达这里了');
      state.option = data
    },
    setAppConfig(state, appConfig) {
      state.appConfig = appConfig;
    },
    setInviteId(state, invite_id) {
      console.log(invite_id, '存入');
      state.invite_id = invite_id;
    },
    setSuperUser(state, is_super_user) {
      state.is_super_user = is_super_user;
      Cache("is_super_user", is_super_user);
    },
    setToken(state, data) {
      state.token = data;
      Cache("token", data);
    },
    setUserInfo(state, data) {
      state.userInfo = data;
      Cache("userInfo", data);
    },
    unlogin(state, data) {
      state.userInfo = {};
      Cache("userInfo", null);
      state.token = "";
      Cache("token", null);
      Cache("cache_key", null);
      uni.$u.toast(data);
      setTimeout(() => {
        uni.$u.route({ url: "/pages/tabbar/index/index", type: "switchTab" });
      }, 200);
    },
    SET_USER_INFO(state, info) {
      state.userInfo = { ...state.userInfo, ...info };
    },
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
    SET_SYSTEM_MESSAGE(state, message) {
      state.systemMessage = message;
    }
  },
  actions: {
    ...api,
    login({ state, commit }, { token, user_info }) {
      commit("setToken", token);
      commit("setUserInfo", user_info);
      Cache("token", token);
      Cache("userInfo", user_info);
    },
    async init({ commit, state, dispatch }) {
      try {
        if (state.appConfig) {
          return state.appConfig;
        }
        const { data: res } = await dispatch("appconfig");
        if (res.pay_status) {
          const arr = pay.filter((item) => {
            console.log(
              res.pay_status[item.type + "_status"] == 1 ||
                res.pay_status[item.type + "_pay_status"] == 1
            );
            return (
              res.pay_status[item.type + "_status"] == 1 ||
              res.pay_status[item.type + "_pay_status"] == 1
            );
          });
          commit("setPayList", arr);
        }

        commit("setAppConfig", res);
        await dispatch('chat/setupSocketListeners')
        await dispatch('blindbox/loadBoxes')
        await dispatch('shop/fetchPromotions')
        await dispatch('danmaku/loadTemplates')
        return res;
      } catch (error) {
        uni.hideLoading();
        console.log(error);
      }
    },

    async autoLogin({ commit, state, dispatch }, info) {
      try {
        let code;
        let infoArr;
        let codeArr;
        let cache_key = Cache("cache_key");
        let req = {};
        //除了H5都调用此方法
        //微信小程序
        // #ifdef MP-WEIXIN
        infoArr = await uni.getUserProfile({ desc: "用户信息" });
        info = await asyncD(infoArr);
        info = info.userInfo;
        // #endif
        if (!cache_key) {
          //#ifndef APP-PlUS
          codeArr = await uni.login();
          code = await asyncD(codeArr);
          //#endif

          //#ifdef APP-PlUS
          const ProviderArr = await uni.getProvider({
            service: "oauth",
          });
          const Provider = await asyncD(ProviderArr);
          if (!~provider.indexOf("weixin")) return uni.$u.toast("登录失败");
          codeArr = await uni.login({
            onlyAuthorize: true,
            provider: "weixin",
          });
          code = await asyncD(codeArr);
          infoArr = await uni.getUserInfo({ withCredentials: true });
          info = await asyncD(infoArr);
          //#endif
        }
        //其他小程序
        //#ifndef APP-PlUS | MP-WEIXIN
        info = JSON.stringify(info);
        //#endif

        req.cache_key = cache_key;
        req.code = code ? code.code : "";
        req.userInfo = info;
        if (state.invite_id) {
          req.invite_id = state.invite_id;
        }
        const res = await dispatch("user_oAuthLogin", req);
        console.log(res, 'res,res');
        if (res.data.cache_key)
          Cache("cache_key", res.data.cache_key, 60 * 60 * 2);

        dispatch("login", res.data);
        return res;
      } catch (error) {
        console.log(error);
        if (error.data) Cache("cache_key", error.data.cache_key, 60 * 60 * 2);
        return Promise.reject(error);
      }
    },
    async authPhoneLogin({ commit, state, dispatch }, obj) {
      try {
        const params = {
          iv: obj.iv,
          cache_key: Cache("cache_key"),
          encryptedData: obj.encryptedData,
        };
        if (state.invite_id) {
          params.invite_id = state.invite_id;
        }
        let res = await dispatch("user_getMpAuthPhone", params);
        let { data } = res;
        return data;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async useTideCoin({ commit, state }, option) {
      // 檢查每日抽獎次數限制
      const today = new Date().toISOString().split('T')[0];
      if (state.userInfo.lastDrawDate !== today) {
        commit('SET_USER_INFO', {
          drawCount: 0,
          lastDrawDate: today
        });
      }
      
      if (state.userInfo.drawCount >= state.userInfo.maxDrawCount) {
        throw new Error('已達每日抽獎次數限制');
      }
      try {
        const res = await this.$api['user/useTideCoin']({
          userId: state.userInfo.id,
          coins: option.coins
        })
        
        commit('SET_USER_INFO', {
          tideCoin: state.userInfo.tideCoin - option.coins
        })
        
        return res
      } catch (error) {
        console.error('Failed to use tide coin:', error)
        throw error
      }
    },
    
    async updateUserInfo({ commit }, info) {
      try {
        const response = await axios.put('/api/user/info', info);
        commit('SET_USER_INFO', response.data);
      } catch (error) {
        console.error('Failed to update user info:', error);
        throw error;
      }
    }
  },
  getters: {
    isLoggedIn: state => state.userInfo.uid > 0,
    userBalance: state => state.userInfo.balance
  }
});
export default store;
