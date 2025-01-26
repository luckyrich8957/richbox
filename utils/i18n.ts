import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { OpenCC } from 'opencc-js';

Vue.use(VueI18n);

// 繁體轉換器
const converter = new OpenCC('s2t.json');

// 语言包
const messages = {
  'zh-TW': {
    common: {
      confirm: '確認',
      cancel: '取消',
      loading: '加載中...',
      success: '成功',
      fail: '失敗',
      error: '錯誤'
    },
    blindbox: {
      open: '開啟盲盒',
      retry: '重新抽取',
      share: '分享',
      remaining: '剩餘次數',
      congratulations: '恭喜獲得',
      hidden: '神秘獎勵'
    },
    chat: {
      placeholder: '輸入訊息...',
      send: '發送',
      history: '聊天記錄'
    },
    payment: {
      coins: '遊戲幣',
      exchange: '兌換',
      balance: '餘額',
      recharge: '充值'
    },
    shop: {
      cart: '購物車',
      checkout: '結帳',
      shipping: '配送資訊',
      review: '評價'
    }
  }
};

// 创建 i18n 实例
const i18n = new VueI18n({
  locale: 'zh-TW',
  messages
});

// 自动转换简体到繁体的函数
export const convertToTraditional = (text: string): string => {
  return converter.convert(text);
};

export default i18n;
