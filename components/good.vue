<template>
  <view class="good" @click="jumpInfo">
    <view class="image">
      <u-image :src="good.img1" bg-color="#fff" height='350rpx' mode='aspectFit' width="350rpx">
        <u-loading slot="loading"></u-loading>
      </u-image>
    </view>
    <view class="title u-line-2">
      {{ good.blind_name }}
    </view>
    <view class="num">
      <u-icon :name='iconName' size="26rpx"></u-icon>
      <text class="t1">{{ good.pay_point || good.price }}</text>
      <text class="t2">{{ good.pay_point || good.market_price }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "good",
  props: {
    index: {
      type: [Number, String]
    },
    icon: {
      type: [Number, String],
      default() {
        return 0
      }
    },
    good: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  mounted() {

  },
  methods: {

    jumpInfo() {
      const params = {}
      const item = this.good
      this.$cache('BlindInfo', item)
      let url = '/pages/list/box' //普通盲盒
      params.id = item.id
      params.jifen_id = item.p_id
      if (this.icon === 1) {
        params.type = 'integral'
      }
      if (item.blind_type === 1) {
        url = '/pages/good/wireless' //无限盲盒
      }
      if (item.blind_type === 2) { //扭蛋机
        url = '/pages/list/egg'     //扭蛋机
      }
      this.$authRoute({
        url: url,
        params
      });
    },
  },
  computed: {
    iconName() {
      switch (this.icon) {
        case 0:
          return 'https://manghe.jikechaowan.com/image/img_11.png'
        case 1:
          return 'https://manghe.jikechaowan.com/image/img_24.png'
        default:
          return 'https://manghe.jikechaowan.com/image/img_11.png'
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.good {
  width: 350rpx;
  height: 516rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 18rpx;

  .image {
    height: 350rpx;
    display: flex;
    align-items: center;
  }

  .title {
    padding: 0 32rpx;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #333;
  }

  .num {
    margin-top: 20rpx;
    padding: 0 32rpx;
    display: flex;

    .t1 {
      font-size: 34rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #0C0C0C;
      margin-left: 10rpx;
      line-height: 1;
    }

    .t2 {
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 400;
      text-decoration: line-through;
      color: #B8B8BA;
      margin-left: 15rpx;
      align-self: flex-end;
      line-height: 1;

    }
  }
}
</style>
