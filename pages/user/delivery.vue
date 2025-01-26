<template>
  <view>
    <view v-if='isChoose' class="box">
      <view class="card-top u-border-bottom u-p-l-16 u-p-r-16">
        <view class="info">
          <view class="u-m-r-36">
            {{ addressInfo.real_name }}
          </view>
          <view class="u-m-r-45">
            {{ addressInfo.phone }}
          </view>
          <view class="btn">
            默认
          </view>
        </view>
        <view class="address u-line-2">
          {{ addressInfo.province }} {{ addressInfo.city }} {{ addressInfo.district }} {{ addressInfo.detail }}
        </view>
      </view>
      <view class="card-bottom" @click="$authRoute({url:'/pages/user/choose',params:{
          ...pageParams,
          ids:JSON.stringify(pageParams.ids)
    }})">
        <view class="left">
          选择其他地址
        </view>
        <u-icon color="#aaa" name='arrow-right' size='28'></u-icon>
      </view>
    </view>
    <view v-else class="empty" @click="$authRoute({url:'/pages/user/choose',params:{
          ...pageParams,
          ids:JSON.stringify(pageParams.ids)
    }})">
      <u-icon name='https://manghe.jikechaowan.com/image/img_34.png' size="46"></u-icon>
      <text>请添加收货地址</text>
    </view>
    <view class="cost">
      <view class="left">
        邮寄费
      </view>
      <view class="right">
        <u-icon name='https://manghe.jikechaowan.com/image/img_11.png' size='26'></u-icon>
        <text>{{ isChoose ? total_price : '0' }}</text>
      </view>
    </view>
    <view class="fixed safe-area-inset-bottom" @click="submitPay">
      <view :class="{btn:true, no:!isChoose}">
        {{ isChoose ? '支付邮寄费后可提交发货' : '提交发货申请' }}
      </view>
    </view>
    <modal11 v-model="showRealAuth" @submit="sureAuth"/>
    <modal12 v-model="showSign" @submit="sureSign"/>
  </view>
</template>

<script>
import modal11 from "@/components/modal11";
import modal12 from "@/components/modal12";

export default {
  components: {
    modal11,
    modal12
  },
  data() {
    return {
      showSign: false,
      showRealAuth: false,
      isChoose: false,
      addressInfo: {},
      pageParams: {
        ids: '',
        show: 0,
      },
      total_price: 0,
      real_auth_step: 0,
    }
  },
  onShow() {
    this.getDefaultAdress();
    //根据订单获取邮费
    this.getPriceInfo();
  },
  onLoad(p) {
    //如果是数组
    if (Array.isArray(p.ids)) {
      this.pageParams = {
		  ...p,
		  ids:JSON.stringify(p.ids)
	  }
    } else {
      //解码
      this.pageParams = {...p, ids: decodeURIComponent(p.ids)}
    }
  },
  methods: {
    sureSign(params) {
      this.toPay(params)
    },
    toPay(signImg) {
		// return console.log(this.pageParams);
      if (signImg) this.pageParams = Object.assign(this.pageParams, {signImg: signImg})
      this.$store.dispatch('order_deliveryToPay', this.pageParams).then((res) => {
        this.$t(res.msg, () => {
          this.$authRoute({
            url: '/pages/reward/reward'
          })
		  uni.$emit('listChange')
        })
      }).catch(res => {
        this.$toast(res.msg)
      })
    },
    sureAuth(params) {
      this.$store.dispatch('user_userAuth', params).then((res) => {
        console.log('diaoyong');
        this.$store.commit('setUserInfo', {...this.$store.state.userInfo, real_auth_step: 1})
        this.real_auth_step = 1; //改为已实名
        this.showRealAuth = false
        this.showSign = true
      }).catch((res) => {
        console.log('diaoyong');
        if (this.$is_debug) {
          this.real_auth_step = 1; //改为已实名
          this.showRealAuth = false
          this.showSign = true
          return true
        }
        return this.$toast('身份验证失败,请核对!')
      })
    },
    getPriceInfo() {
      this.$store.dispatch('order_deliveryGoodsInfo', this.pageParams).then((res) => {
        this.total_price = res.data.total_price
        this.real_auth_step = res.data.real_auth_step
      }).catch(() => {
			
      })
    },
    getDefaultAdress() {
      this.$store.dispatch('my_getDefaultAddress').then((res) => {
        this.isChoose = true
        this.addressInfo = res.data.info
      }).catch(() => {
        this.isChoose = false
      })
    },
    submitPay() { 
		if(!this.addressInfo.real_name){
			return this.$toast('请先添加收货地址')
		}
		//检测用户是否已经实名
      if (this.real_auth_step === 0) {
        //实名认证弹窗
        this.showRealAuth = true
        return false
      }
      if (this.real_auth_step === 1) {
        //手写收入弹窗
        this.showSign = true
        return false
      }
      this.toPay()
      //否则则去下单

    }
  }
}
</script>

<style>
page {
  background-color: #fafafa;
  padding-top: 26 rpx;
}
</style>
<style lang="scss" scoped>
.empty {
  height: 256rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 76rpx;
  margin: 0 16rpx;

  text {
    margin-top: 26rpx;
    line-height: 1;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }
}

.fixed {
  position: fixed;
  z-index: 99;
  height: 110rpx;
  background-color: #fafafa;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn {
    width: 718rpx;
    height: 90rpx;
    background: #323232;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
  }

  .no {
    background: #EEEEEE;
    color: #B8B8BA;
  }
}

.box {
  margin: 0 16rpx;
  height: 256rpx;
  background: #FFFFFF;
  border-radius: 16rpx;

  .card-top {
    height: 176rpx;
  }

  .info {
    padding: 0 32rpx;
    display: flex;
    padding-top: 41rpx;
    align-items: center;

    view {
      line-height: 1;
      font-size: 28rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #333333;
    }

    .btn {
      width: 64rpx;
      height: 32rpx;
      background: #323232;
      border-radius: 4rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22rpx;
      line-height: 1;
      font-family: PingFangSC;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .card-bottom {
    padding: 0 32rpx;
    display: flex;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    height: 79rpx;

    .left {
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #333333;
    }
  }

  .address {
    padding: 0 32rpx;
    margin-top: 28rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
    line-height: 30rpx;
  }
}

.cost {
  padding: 0 34rpx;
  margin: 26rpx 16rpx 0;
  height: 112rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .right {
    display: flex;
    align-items: center;

    text {
      line-height: 1;
      margin-left: 11rpx;
      font-size: 34rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #0C0C0C;
    }
  }
}
</style>
