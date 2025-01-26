//缓存键值对
// 全局配置

export const DEBUG = false;
export const HTTP_REQUEST_URL = DEBUG
  ? "https://test.jikechaowan.com/"
  : "https://test.jikechaowan.com/";
export const ws = DEBUG
  ? "https://dj.smiaoshen.com"
  : "https://sms.gongxiang918.com/";
export const APP_CONFIG = {
  // TABBAR: ['/pages/index/index','/pages/i'],
  default_header: "https://sms.gongxiang918.com/sms_img/header.png",
  INDEX_PAGE: "/pages/tabbar/index/index",
  LOGIN: "/pages/login/login",
  STATIC_REQUEST_URL: "https://pintuan.hgd86.com/miniImg/",
  BASE_URL: HTTP_REQUEST_URL + "/api",
  // 上传地址
  UPLOAD: HTTP_REQUEST_URL + "/api/upload/file",
};
export const WX_AUTH = "WX:AUTH:";
export const STATE_KEY = "STATE:KEY:";
export const LOGINTYPE = "LOGINTYPE:";
export const BACK_URL = "H5:BACK_URL:";
