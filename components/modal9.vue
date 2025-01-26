<template>
  <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="600rpx">
    <view class="content">
      <view class="label">
        物流公司
      </view>
      <view class="info">
        {{ delivery_order.express_name }}
      </view>
      <view class="label u-m-t-56" style='margin-bottom: 10rpx;'>
        快递单号
      </view>
      <view class="code" @click="copy">
        <view class="text">
          {{ delivery_order.express_code }}
        </view>
        <view class="btn">
          复制
        </view>
      </view>
      <view class="tip" @click="copy">
        您可以复制快递单号后到支付宝等快递查询平台查 询快递邮寄进度
      </view>
    </view>
  </u-popup>
</template>

<script>
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'

export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    delivery_order: {
      type: Object,
      default() {
        return {
          express_name: '',
          express_code: ''
        }
      }
    }
  },
  methods: {
    copy() {
      uniCopy({
        content: 'uni复制插件',
        success: (res) => {
          uni.showToast({
            title: res,
            icon: 'none'
          })
        },
        error: (e) => {
          uni.showToast({
            title: e,
            icon: 'none',
            duration: 3000,
          })
        }
      })
    }
  },
  computed: {
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
  height: 460rpx;
  padding: 0 57rpx;
  padding-top: 80rpx;

  .label {
    line-height: 1;
    margin-bottom: 25rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .info {
    font-size: 26rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
    line-height: 30rpx;
  }

  .code {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      font-size: 26rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #333333;
      line-height: 30px;

    }

    .btn {
      width: 68rpx;
      height: 36rpx;
      background: #EEEEEE;
      border-radius: 4rpx;
      line-height: 36rpx;
      text-align: center;
      font-size: 22rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #333333;
    }
  }

  .tip {
    margin-top: 41rpx;
    font-size: 22rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #B8B8BA;
  }
}
</style>
