<!-- 实名认证页面 -->
<template>
  <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="672rpx">
    <view class="content">
      <view class="title">
        实名认证
      </view>
      <view class="text">
        * 未成年用户无法购买盲盒，如您已满18周岁请进行 实名认证
      </view>
      <view class="label">
        用户姓名
      </view>
      <view class="input">
        <u-input :clearable="false" style='flex:1' maxlength='6' :value='name' placeholder="请输入你的姓名" @input="(e)=>input(e,'name')"/>
      </view>
      <view class="label">身份证号</view>
      <view class="input">
        <u-input :clearable="false" style='flex:1' type='idcard' maxlength='20' :value='code' placeholder="请输入你的身份证号" @input="(e)=>input(e,'code')"/>
      </view>
      <view :style="{opacity: showTip?'0':'1'}" class="tip">
        *{{ tip }}
      </view>
      <view :class="{btn:true,no:!btn}" @click="submit">
        签名确认
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      btn: false,
      name: '',
      code: '',
      tip: '您输入的姓名或身份证号信息与真实信息不符，请重新输入',
    };
  },
  props: ['value'],
  methods: {
    input(e, type) {
      this[type] = e
      if (this.name.match(/^[\u4E00-\u9FA5]{2,6}$/) && this.code.match(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/)) {
        //判断是否已满18周岁
        let birth = this.code.substring(6, 10) + '-' + this.code.substring(10, 12) + '-' + this.code.substring(12, 14)
        let myDate = new Date()
        let myYear = myDate.getFullYear()
        let myMonth = myDate.getMonth() + 1
        let myDay = myDate.getDate()
        let age = myYear - birth.substring(0, 4)
        if (myMonth < birth.substring(5, 7)) {
          age--
        } else if (myMonth == birth.substring(5, 7) && myDay < birth.substring(8, 10)) {
          age--
        }
        if (age < 18) {
          this.tip = '您还未满18周岁无法购买盲盒，可以分享赚钱哦，以后再来吧'
          this.btn = false
        } else {
          this.btn = true
        }
      } else {
        this.tip = '您输入的姓名或身份证号信息与真实信息不符，请重新输入'
        this.btn = false
      }
    },
    submit() {
      this.$emit('submit', {fullname: this.name, card_id: this.code})
    },
  },
  computed: {
	  showTip(){
		 if(this.name.length==0&&this.code.length==0) return true
		  return this.btn
	  },
    _show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 748rpx;
  padding: 60rpx 56rpx 0;

  .label {
    font-size: 24rpx;
    color: #333333;
    margin-top: 40rpx;
    line-height: 1;
    margin-bottom: 15rpx;
  }

  .tip {
    font-size: 20rpx;
    line-height: 1;
    margin-top: 16rpx;
    margin-bottom: 44rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #EB555B;
  }

  .btn {
    height: 90rpx;
    background: #323232;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #FFFFFF;
  }

  .no {
    background: #C7C7CB;
  }

  .input {
    padding: 0 36rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    background: #F4F4F4;
    border-radius: 12rpx;
  }

  .title {
    font-size: 36rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
    line-height: 1;
    text-align: center;
    margin: 0rpx auto 25rpx;
  }

  .text {
    margin-top: 32rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
    line-height: 36rpx;
  }
}
</style>
