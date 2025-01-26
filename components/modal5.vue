<template>
  <u-popup v-model='_show' :closeable="true" border-radius="40" mode='center' width="650rpx">
    <view class="content">
      <view class="title">
        奖品分解
      </view>
      <view class="text">
        <view class="u-flex u-col-center u-row-center u-m-b-10">
          奖品分解后，将可得到
          <u-image class="u-m-l-15 u-m-r-15" height="35rpx" src="@/static/material/crystal.png" width="26rpx"></u-image>
          <text>{{ money(num1===0?num:num1)}}</text>
        </view>
        晶石可以在“我的-晶石”模块兑换K币。
      </view>
      <view class="btns">
        <view class="btn t" @click="_show=false">
          取消
        </view>
        <view class="btn t1" @click="submit">
          确认
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
		num1:0,
    };
  },
  props: ['value', 'num'],
  methods: {
    submit() {
      this.$emit('submit')
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
  height: 386rpx;
  padding-top: 80rpx;

  .title {
    font-size: 36rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
    line-height: 1;
    text-align: center;
    margin: 0rpx auto 30rpx;
  }

  .text {
    padding: 0 55rpx;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
    line-height: 30rpx;
    text-align: center;
  }

  .btns {
    margin-top: 35rpx;
    padding: 0 40rpx;
    display: flex;
    justify-content: space-between;

    .btn {
      width: 260rpx;
      height: 90rpx;
      background: #EEEEEE;
      border-radius: 16rpx;
      line-height: 90rpx;
      text-align: center;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #333333;
    }

    .t1 {
      background: #EB555B;
      color: #fff;
    }

  }
}
</style>
