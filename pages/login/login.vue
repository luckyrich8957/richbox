<template>
  <view class="pages">
    <u-image height="226rpx" src="https://manghe.jikechaowan.com/image/slogan.png"
             width='391rpx'></u-image>

    <!-- #ifdef MP-WEIXIN-->
    <u-button :custom-style="customStyle" :hair-line="false" :loading="loading" :plain="true" hover-class="none"
              @click="wxlogin">微信登录
    </u-button>
    <!-- #endif -->

    <!-- #ifdef  MP-BAIDU -->
    <u-button :custom-style="customStyle" :hair-line="false" :loading="loading" :plain="true" hover-class="none"
              open-type="getUserInfo"
              @getuserinfo="wxlogin">授权登录
    </u-button>
    <!-- #endif -->

    <!-- #ifdef   MP-ALIPAY -->

    <button open-type="getAuthorize" class="u-reset-button" :style="customStyle" @getAuthorize="wxlogin" scope='userInfo' :custom-style="customStyle">
      授权登录</button>
    <!-- #endif -->

    <!-- #ifdef MP-QQ	-->
<u-button :custom-style="customStyle"
 open-type="getUserInfo"
 @getuserinfo="wxlogin"
 :hair-line="false" :loading="loading" :plain="true" hover-class="none"
>QQ授权登录
    </u-button>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <u-button :custom-style="customStyle2" :hair-line="false" :plain="true" hover-class="none" @click="goPhone">
      手机号登录/注册
    </u-button>
    <!-- #endif -->
    <view class="radio">
      <u-checkbox v-model="flag" class="checkbox" shape="circle"></u-checkbox>
      <view @tap='flag=!flag' class="text u-flex">
        <view>已阅读并同意</view>
        <view @tap.stop="agreementClick"  style="color: #333 ;padding-left: 10rpx">用户协议、隐私政策、买家须知</view>
      </view>
      <u-modal v-model="show" :mask-close-able="true" content="我已阅读并同意用户协议、隐私政策、买家须知" @confirm="confirm">
      </u-modal>
      <model14 v-model="showModel" title="用户协议、隐私政策、买家须知" uid="3" @submit="(e)=>flag=e"/>
    </view>
  </view>
</template>

<script>
import model14 from '@/components/modal14.vue'
import {autoLogin} from "@/utils/util";

function asyncD(arr) {
  return new Promise((resolve, reject) => {
    if (arr[0]) {
      reject(arr[0])
    } else {
      resolve(arr[1])
    }
  })
}

export default {
  components: {
    model14
  },
  data() {
    return {
      showModel: false,
      show: false,
      loading: false,
      flag: false,
      customStyle: {
        width: '638rpx',
        border: 'none',
        backgroundColor: '#323232',
        'color': '#ffffff',
        marginTop: '193rpx',
      },
      customStyle2: {
        width: '638rpx',
        border: 'none',
        backgroundColor: '#eee',
        color: '#333',
        // #ifdef MP
        marginTop: '26rpx',
        // #endif
        // #ifndef MP
        marginTop: '193rpx',
        // #endif

      }
    };
  },
  methods: {
    onAuthError(e){
      console.log("eeee",e)
    },
    confirm() {
      this.flag = true;
      this.$nextTick(() => {
        this.wxlogin();
      })
    },
    getUserInfo(e) {
      console.log("eeee....", e)
    },
    goPhone() {
      if (!this.flag) return this.$toast('请同意隐私协议!')
      uni.navigateTo({
        url: '/pages/login/phone'
      })
    },
    agreementClick(e) {
      console.log(111);
      this.showModel = true;
      //禁止冒泡
    },
    checkClick() {
      this.flag = !this.flag
    },
    async wxlogin(e) {
	console.log(e);
      e = e || {}
      let arr  = {};
      //#ifdef MP-QQ
      if (e && e.detail && e.detail.errMsg == 'getUserInfo:ok') {
        //#endif
        //#ifdef MP-ALIPAY
        let res = await uni.getUserInfo()
        if(res[1]){
          e.detail = res[1]
        }
        //#endif
        e.detail = e.detail || {}
        arr = e.detail.userInfo;
        this.loading = false;
        if (!this.flag) {
          this.show = true;
          return this.loading = false;
        }
        uni.showLoading({
          title:'登录中'
        })
        this.$store.dispatch('autoLogin', arr).then(res => {
          this.$store.dispatch('login', res).then((item) => {
            console.log("res",item)
            this.$t('登录成功',()=>{
              this.$util.Backurl()
            })
          }).catch((err)=>{
			  return this.$u.toast(err.msg||err)	
            console.log(err);
          })
        }).catch(err => {
			uni.hideLoading()
			console.log(err); 
          if(err.errMsg && !err.cache_key){
			        return this.$u.toast('您已拒绝授权')
		      }
          //#ifdef MP-WEIXIN ||  MP-ALIPAY
          if (err.cache_key) {
           return this.$t('您还未绑定手机号',()=>this.$authRoute({url: '/pages/login/autoLogin', params: err}))
          }
          //#endif
        })
        //#ifdef MP-QQ
      }
      //#endif

    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
}

.pages {;
  padding-top: 106rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.u-reset-button{
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 30rpx;
}
.radio {
  display: flex;
  align-items: center;
  margin-top: 142rpx;

  /deep/ .u-checkbox__label {
    margin-right: 5rpx;
  }

  .checkbox {
    //  缩小
    transform: scale(0.8);
  }

  .text {
    font-size: 22rpx;
    color: #B8B8BA;

  }
}
</style>
