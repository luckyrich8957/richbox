module.exports = {
  onLoad() {
  },
  computed:{
	  $mpShare(){
		  return {
			  title:this.$store.state.appConfig&&this.$store.state.appConfig.share_config?this.$store.state.appConfig.share_config.share_content:'', // 默认为小程序名称
			  path: this.$store.state.userInfo&&this.$store.state.userInfo.uid?'/pages/tabbar/index/index?invite_id='+this.$store.state.userInfo.uid:'/pages/tabbar/index/index', // 默认为当前页面路径
			  imageUrl:this.$store.state.appConfig?this.$store.state.appConfig.share_config.share_img:'', // 默认为当前页面的截图
		  }
	  },
  },
  methods: {
    $getPath() {
      let _page = this.$getUrl();
      let ruleOut = [
        "coupon_user_id",
        "coupon_price",
        "num",
        "state",
        "blind_type",
        "reward_goods_num",
        "box_num",
        "winning_num",
      ];
      let url = _page.split("?")[1];
      if (!_page.split("?")[1]) {
        if (this.$store.state.userInfo.uid) {
          return _page + "?invite_id=" + this.$store.state.userInfo.uid;
        } else {
          return _page;
        }
      }
      let params = url.split("&");
      let obj = {};
      params.forEach((item) => {
        let arr = item.split("=");
        if (ruleOut.includes(arr[0])) return;
        obj[arr[0]] = arr[1];
      });
      //还原成url
      let str = "";
      for (let key in obj) {
        str += `${key}=${obj[key]}&`;
      }
      str = str.slice(0, -1);
      if (this.$store.state.userInfo.uid) {
        return (
          _page.split("?")[0] +
          "?" +
          str +
          "&invite_id=" +
          this.$store.state.userInfo.uid
        );
      } else {
        return _page.split("?")[0] + "?" + str;
      }
    },
  },
  onShareAppMessage(res) {
    console.log(this.$mpShare);
    return this.$mpShare;
  },
  // #ifdef MP-WEIXIN
  onShareTimeline() {
    return this. $mpShare;
  },
  // #endif
};
