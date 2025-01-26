<template>
  <view class="pages">
    <u-image src="https://manghe.jikechaowan.com/image/slogan.png" width='391rpx' height="226rpx"></u-image>
    <!-- #ifdef MP-WEIXIN-->
    <u-button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" :hair-line="false" hover-class="none" :plain="true"
              :custom-style="customStyle2">授权手机号完成登录
    </u-button>
    <!-- #endif -->
    <!-- #ifdef MP-ALIPAY-->
    <button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber" :style='customStyle2' class="u-reset-button btn" :hair-line="false" hover-class="none" :plain="true"
            :custom-style="customStyle2">授权手机号完成登录
    </button>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      loading: false,
      flag: false,
      customStyle2: {
        width: '638rpx',
        border: 'none',
        backgroundColor: '#448ef6',
        color: '#fff',
        marginTop: '193rpx',
        height: '100rpx'
      },
      pageParams: {}
    };
  },
  onLoad(options) {
    this.pageParams = options
  },
  methods: {
    getPhoneNumber(e) {
      console.log("e",e)
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        //成功 encryptedData iv
        uni.showLoading({
          title:'登录中'
        })
        this.$store.dispatch('authPhoneLogin', e.detail).then((res) => {
          let params = Object.assign(this.pageParams, res, {invite_id: this.$store.state.invite_id})
          this.$store.dispatch('user_authRegister', Object.assign(this.pageParams, res)).then((res) => {
            let {data} = res
            this.$store.dispatch('login', data)
            this.$t(res.msg, () => {
              this.$util.Backurl()
            })
          }).catch((err)=>{
            console.log(err);
            this.$u.toast(err.msg)
          })
        }).catch((err)=>{
          console.log(err);
          this.$u.toast('登录失败')
        })
      } else {
        this.$t('取消登录!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
}
.u-reset-button{
	border:none;
}
.btn{
	display: flex;
	align-items: center;
	justify-content: center;
	font-size:32rpx;
}
.pages {;
  padding-top: 106rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
